import { LoadBalancerSettings, RandomWalkStrategy } from "@iota/client-load-balancer";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { INodeConfiguration } from "p2p-energy-common/dist/models/config/INodeConfiguration";
import { ISourceStore } from "p2p-energy-common/dist/models/db/producer/ISourceStore";
import { IMamCommand } from "p2p-energy-common/dist/models/mam/IMamCommand";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { IRegistrationManagementService } from "p2p-energy-common/dist/models/services/IRegistrationManagementService";
import { IStorageService } from "p2p-energy-common/dist/models/services/IStorageService";
import { IRegistration } from "p2p-energy-common/dist/models/services/registration/IRegistration";
import { IConsumerManagerState } from "p2p-energy-common/dist/models/state/IConsumerManagerState";
import { IGridManagerState } from "p2p-energy-common/dist/models/state/IGridManagerState";
import { IProducerManagerState } from "p2p-energy-common/dist/models/state/IProducerManagerState";
import { ISourceManagerState } from "p2p-energy-common/dist/models/state/ISourceManagerState";
import { ConsumerManager } from "p2p-energy-common/dist/services/consumerManager";
import { GridManager } from "p2p-energy-common/dist/services/gridManager";
import { ProducerManager } from "p2p-energy-common/dist/services/producerManager";
import { DirectRegistrationService } from "p2p-energy-common/dist/services/registration/directRegistrationService";
import { RegistrationManagementService } from "p2p-energy-common/dist/services/registrationManagementService";
import { SourceManager } from "p2p-energy-common/dist/services/sourceManager";
import { BrowserStorageService } from "p2p-energy-common/dist/services/storage/browserStorageService";
import { IGrid } from "../models/api/IGrid";
import { IDemoConsumerState } from "../models/services/IDemoConsumerState";
import { IDemoGridState } from "../models/services/IDemoGridState";
import { IDemoProducerState } from "../models/services/IDemoProducerState";
import { IDemoSourceState } from "../models/services/IDemoSourceState";

/**
 * DemoGridManager Class.
 */
export class DemoGridManager {
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings: LoadBalancerSettings;

    /**
     * The demo grid storage service.
     */
    private _demoGridStateStorageService: IStorageService<IDemoGridState>;

    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The id of the loaded grid.
     */
    private _gridId?: string;

    /**
     * The state of the grid.
     */
    private _gridState: IDemoGridState;

    /**
     * The grid manager.
     */
    private _gridManager?: GridManager;

    /**
     * The producer managers.
     */
    private _producerManagers?: { [id: string]: ProducerManager };

    /**
     * The consumer managers.
     */
    private _consumerManagers?: { [id: string]: ConsumerManager };

    /**
     * The source managers.
     */
    private _sourceManagers?: {
        [id: string]: {
            /**
             * The producer that the source belongs to.
             */
            producerId: string;
            /**
             * The source manager.
             */
            sourceManager: SourceManager;
        };
    };

    /**
     * Timer used for updates.
     */
    private _updateTimer?: NodeJS.Timer;

    /**
     * Subscriptions to the grid state changes.
     */
    private readonly _subscriptionsGrid: { [id: string]: (state: IDemoGridState | undefined) => void };

    /**
     * Subscriptions to the producer state changes.
     */
    private readonly _subscriptionsProducer: { [id: string]: (state: IDemoProducerState | undefined) => void };

    /**
     * Subscriptions to the consumer state changes.
     */
    private readonly _subscriptionsConsumer: { [id: string]: (state: IDemoConsumerState | undefined) => void };

    /**
     * Subscriptions to the source state changes.
     */
    private readonly _subscriptionsSource: { [id: string]: (state: IDemoSourceState | undefined) => void };

    /**
     * Create a new instance of DemoGridManager.
     * @param loadBalancerSettings Load balancer settings for communications.
     */
    constructor(loadBalancerSettings: LoadBalancerSettings) {
        this._loadBalancerSettings = loadBalancerSettings;

        this._demoGridStateStorageService = ServiceFactory.get<IStorageService<IDemoGridState>>("demo-grid-state-storage");
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");

        this._subscriptionsGrid = {};
        this._subscriptionsProducer = {};
        this._subscriptionsConsumer = {};
        this._subscriptionsSource = {};
        this._gridState = {
            producerStates: {},
            consumerStates: {},
            sourceStates: {},
            secondsCounter: 0
        };
    }

    /**
     * Initialise the state from the grid.
     * @param grid The grid to populate from.
     * @param progressCallback Send callback messages.
     */
    public async initialise(grid: IGrid, progressCallback: (status: string) => void): Promise<void> {
        this.closedown();

        const loadedState = await this._demoGridStateStorageService.get(grid.id);

        this._gridId = grid.id;
        this._gridState = loadedState || {
            producerStates: {},
            consumerStates: {},
            sourceStates: {},
            secondsCounter: 0
        };

        await this.constructManagers(grid, progressCallback);

        if (this._gridState) {
            this.updateGridSubscribers();

            this.updateProducerSubscribers();
            this.updateConsumerSubscribers();
            this.updateSourceSubscribers();

            await this._demoGridStateStorageService.set(grid.id, this._gridState);
        }

        this.startUpdates();
    }

    /**
     * Closedown the grid.
     */
    public closedown(): void {
        this.stopUpdates();
        this.clearManagers();
    }

    /**
     * Subscribe to grid state changes.
     * @param context The context of the item subscribing.
     * @param callback The callback for the subscription.
     */
    public subscribeGrid(context: string, callback: (state: IDemoGridState | undefined) => void): void {
        this._subscriptionsGrid[context] = callback;
        callback(this.getGridState());
    }

    /**
     * Unsubscribe from grid state changes.
     * @param context The context of the item subscribing.
     */
    public unsubscribeGrid(context: string): void {
        delete this._subscriptionsGrid[context];
    }

    /**
     * Subscribe to producer state changes.
     * @param context The context of the item subscribing.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeProducer(context: string, id: string, callback: (state: IDemoProducerState | undefined) => void): void {
        this._subscriptionsProducer[`${id}/${context}`] = callback;
        callback(this.getProducerState(id));
    }

    /**
     * Unsubscribe from producer state changes.
     * @param context The context of the item subscribing.
     * @param id The id of the grid to subscribe to.
     */
    public unsubscribeProducer(context: string, id: string): void {
        delete this._subscriptionsProducer[`${id}/${context}`];
    }

    /**
     * Subscribe to consumer state changes.
     * @param context The context of the item subscribing.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeConsumer(context: string, id: string, callback: (state: IDemoConsumerState | undefined) => void): void {
        this._subscriptionsConsumer[`${id}/${context}`] = callback;
        callback(this.getConsumerState(id));
    }

    /**
     * Unsubscribe from consumer state changes.
     * @param context The context of the item subscribing.
     * @param id The id of the consumer to unsubscribe.
     */
    public unsubscribeConsumer(context: string, id: string): void {
        delete this._subscriptionsConsumer[`${id}/${context}`];
    }

    /**
     * Subscribe to source state changes.
     * @param context The context of the item subscribing.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeSource(context: string, id: string, callback: (state: IDemoSourceState | undefined) => void): void {
        this._subscriptionsSource[`${id}/${context}`] = callback;
        callback(this.getSourceState(id));
    }

    /**
     * Unsubscribe from source state changes.
     * @param context The context of the item subscribing.
     * @param id The id of the source to unsubscribe from.
     */
    public unsubscribeSource(context: string, id: string): void {
        delete this._subscriptionsSource[`${id}/${context}`];
    }

    /**
     * Get the current state of the grid
     * @returns The grid state.
     */
    public getGridState(): IDemoGridState | undefined {
        const state = this._gridState;
        if (state && this._gridManager) {
            state.gridManagerState = this._gridManager.getState();
        }
        return state;
    }

    /**
     * Get the current state of a producer
     * @param id The id of the producer to get.
     * @returns The producer state.
     */
    public getProducerState(id: string): IDemoProducerState | undefined {
        const state = this._gridState && this._gridState.producerStates[id];
        if (state && this._producerManagers && this._producerManagers[id]) {
            state.producerManagerState = this._producerManagers[id].getState();
        }
        return state;
    }

    /**
     * Get the current state of a consumer
     * @param id The id of the consumer to get.
     * @returns The consumer state.
     */
    public getConsumerState(id: string): IDemoConsumerState | undefined {
        const state = this._gridState && this._gridState.consumerStates[id];
        if (state && this._consumerManagers && this._consumerManagers[id]) {
            state.consumerManagerState = this._consumerManagers[id].getState();
        }
        return state;
    }

    /**
     * Get the current state of a source
     * @param id The id of the source to get.
     * @returns The source state.
     */
    public getSourceState(id: string): IDemoSourceState | undefined {
        const state = this._gridState && this._gridState.sourceStates[id];
        if (state && this._sourceManagers && this._sourceManagers[id]) {
            state.sourceManagerState = this._sourceManagers[id].sourceManager.getState();
        }
        return state;
    }

    /**
     * Update the subscribers for the grid.
     */
    private updateGridSubscribers(): void {
        const state = this.getGridState();
        for (const context in this._subscriptionsGrid) {
            this._subscriptionsGrid[context](state);
        }
    }

    /**
     * Update the subscribers for the producers.
     */
    private updateProducerSubscribers(): void {
        for (const idContext in this._subscriptionsProducer) {
            const parts = idContext.split("/");
            this._subscriptionsProducer[idContext](this.getProducerState(parts[0]));
        }
    }

    /**
     * Update the subscribers for the consumers.
     */
    private updateConsumerSubscribers(): void {
        for (const idContext in this._subscriptionsConsumer) {
            const parts = idContext.split("/");
            this._subscriptionsConsumer[idContext](this.getConsumerState(parts[0]));
        }
    }

    /**
     * Update the subscribers for the sources.
     */
    private updateSourceSubscribers(): void {
        for (const idContext in this._subscriptionsSource) {
            const parts = idContext.split("/");
            this._subscriptionsSource[idContext](this.getSourceState(parts[0]));
        }
    }

    /**
     * Stop the update timer.
     */
    private stopUpdates(): void {
        if (this._updateTimer) {
            clearInterval(this._updateTimer);
            this._updateTimer = undefined;
        }
    }

    /**
     * Start the update timer.
     */
    private startUpdates(): void {
        if (!this._updateTimer) {
            this._updateTimer = setInterval(() => this.updateManagers(), 10000);
        }
    }

    /**
     * Initialise all the service required by the manangers.
     * @param grid Grid to create services for.
     */
    private async initialiseServices(grid: IGrid): Promise<void> {
        ServiceFactory.register(
            "grid-storage-manager-state",
            () => new BrowserStorageService<IGridManagerState>(`grid-manager-state`));

        ServiceFactory.register(
            "producer-storage-manager-state",
            () => new BrowserStorageService<IProducerManagerState>(`producer-manager-state`));

        ServiceFactory.register(
            "registration-storage",
            () => new BrowserStorageService<IRegistration>(`registrations/${grid.id}`));

        ServiceFactory.register(
            "registration-management",
            () => new RegistrationManagementService(this._loadBalancerSettings, (registration) => registration.itemType === "consumer"));

        ServiceFactory.register(
            "producer-registration",
            () => new DirectRegistrationService("registration-management"));

        ServiceFactory.register(
            "producer-source-output-store",
            () => new BrowserStorageService<ISourceStore>(`producer-source-output`));

        ServiceFactory.register(
            "consumer-storage-manager-state",
            () => new BrowserStorageService<IConsumerManagerState>(`consumer-manager-state`));

        ServiceFactory.register(
            "consumer-registration",
            () => new DirectRegistrationService("registration-management"));

        ServiceFactory.register(
            "source-storage-manager-state",
            () => new BrowserStorageService<ISourceManagerState>(`source-manager-state`));

        ServiceFactory.register(
            "source-registration",
            () => new DirectRegistrationService("registration-management"));

        ServiceFactory.register(
            "grid-producer-output-store",
            () => new BrowserStorageService<ISourceStore>(`grid-producer-output`));

        ServiceFactory.register(
            "grid-consumer-usage-store",
            () => new BrowserStorageService<ISourceStore>(`grid-consumer-usage`));
    }

    /**
     * Clear the managers for each of the entities.
     */
    private clearManagers(): void {
        this._gridManager = undefined;
        this._producerManagers = undefined;
        this._sourceManagers = undefined;
        this._consumerManagers = undefined;
    }

    /**
     * Construct the managers for each of the entities.
     * @param grid Grid to construct the managers for.
     * @param progressCallback Send callback messages.
     */
    private async constructManagers(grid: IGrid, progressCallback: (status: string) => void): Promise<void> {
        this.initialiseServices(grid);

        const registrationManagementService = ServiceFactory.get<IRegistrationManagementService>("registration-management");
        await registrationManagementService.loadRegistrations();

        progressCallback("Initializing Grid.");
        if (!this._gridManager) {
            this._gridManager = new GridManager({ name: grid.name, id: grid.id }, this._loadBalancerSettings);
            await this._gridManager.initialise();
        }

        this._producerManagers = this._producerManagers || {};
        this._sourceManagers = this._sourceManagers || {};
        this._consumerManagers = this._consumerManagers || {};

        for (let p = 0; p < grid.producers.length; p++) {
            const producer = grid.producers[p];

            progressCallback(`Initializing Producer '${producer.name}' [${producer.id}].`);
            if (!this._producerManagers[producer.id]) {
                this._producerManagers[producer.id] = new ProducerManager({ name: producer.name, id: producer.id }, this._loadBalancerSettings);
                await this._producerManagers[producer.id].initialise();
            }

            this._gridState.producerStates[producer.id] = this._gridState.producerStates[producer.id] || {
                outputCommands: []
            };

            for (let s = 0; s < producer.sources.length; s++) {
                const source = producer.sources[s];

                progressCallback(`Initializing Source '${source.name}' [${source.id}].`);
                if (!this._sourceManagers[source.id]) {
                    this._sourceManagers[source.id] = {
                        producerId: producer.id,
                        sourceManager: new SourceManager({ name: source.name, id: source.id, type: source.type }, this._loadBalancerSettings)
                    };
                    await this._sourceManagers[source.id].sourceManager.initialise();
                }

                this._gridState.sourceStates[source.id] = this._gridState.sourceStates[source.id] || {
                    outputCommands: []
                };
            }
        }

        for (let c = 0; c < grid.consumers.length; c++) {
            const consumer = grid.consumers[c];

            progressCallback(`Initializing Consumer '${consumer.name}' [${consumer.id}].`);
            if (!this._consumerManagers[consumer.id]) {
                this._consumerManagers[consumer.id] = new ConsumerManager({ name: consumer.name, id: consumer.id }, this._loadBalancerSettings);
                await this._consumerManagers[consumer.id].initialise();
            }

            this._gridState.consumerStates[consumer.id] = this._gridState.consumerStates[consumer.id] || {
                usageCommands: []
            };
        }
    }

    /**
     * Update all the managers.
     */
    private async updateManagers(): Promise<void> {
        if (this._gridId) {
            // In a real system the individual manager updates would be performed
            // by the standalone entities.
            this._gridState.secondsCounter += 10;

            await this.updateRegistrations();

            await this.updateSourceManagers();

            await this.updateProducerManagers();

            await this.updateConsumerManagers();

            await this._demoGridStateStorageService.set(this._gridId, this._gridState);
        }
    }

    /**
     * Update all the registrations.
     */
    private async updateRegistrations(): Promise<void> {
        // First step on an update is to check all the mam registrations for new
        // commands in their channels
        const registrationManagementService = ServiceFactory.get<IRegistrationManagementService>("registration-management");
        await registrationManagementService.pollCommands(async (registration: IRegistration, commands: IMamCommand[]) => {
            // Producers and consumers are registered with the grid, so hand the commands to the grid manager
            if (registration.itemType === "producer" || registration.itemType === "consumer") {
                if (this._gridManager) {
                    await this._gridManager.handleCommands(registration, commands);
                }
            } else {
                // All other registrations are sources with producers, so find which
                // producer the source belongs to.
                if (this._sourceManagers && this._sourceManagers[registration.id]) {
                    if (this._producerManagers && this._producerManagers[this._sourceManagers[registration.id].producerId]) {
                        await this._producerManagers[this._sourceManagers[registration.id].producerId].handleCommands(registration, commands);
                    }
                }
            }
        });
    }

    /**
     * Update the managers for the sources.
     */
    private async updateSourceManagers(): Promise<void> {
        // tslint:disable:insecure-random
        // Create some dummy output data for the sources using the loop counter as the time
        // In a real life scenario this would come from the actual device
        // and at an interval of the implementers choice
        if (this._sourceManagers) {
            for (const sourceId in this._sourceManagers) {
                // Range the source output from 0 to 1000
                const outputCommand = await this._sourceManagers[sourceId].sourceManager.sendOutputCommand(this._gridState.secondsCounter, Math.random() * 1000);
                // Add the output to the local state and keep just the most recent 10
                this._gridState.sourceStates[sourceId].outputCommands.push(outputCommand);
                this._gridState.sourceStates[sourceId].outputCommands = this._gridState.sourceStates[sourceId].outputCommands.slice(-10);
            }
            // Notify any local subscribers of the source updates
            this.updateSourceSubscribers();
        }
    }

    /**
     * Update the managers for the producers.
     */
    private async updateProducerManagers(): Promise<void> {
        // Update the producers so they can collate the output from all their sources
        // They need to use an end time in the past otherwise the may not have seen the updated
        // commands from all the sources
        if (this._producerManagers) {
            // Collate only up to 3 readings ago allowing sources to propogate their data
            const endTimeCollate = this._gridState.secondsCounter - 30;
            if (endTimeCollate > 0) {
                for (const producerId in this._producerManagers) {
                    const commands = await this._producerManagers[producerId].update(
                        endTimeCollate,
                        (startTime, endTime, combinedValue) => {
                            // Calculate a cost for the producer output slice, you could base this on time of day, value etc
                            return 1000;
                        },
                        (sourceId, sourceStoreOutput) => {
                            // Source outputs are removed when they are collated
                            // but you can archive the used blocks if required in this callback
                            this._loggingService.log("demo-grid-manager", `Archive source outputs '${sourceId}'`, sourceStoreOutput);
                        });

                    if (commands.length > 0) {
                        // Add the output to the local state and keep just the most recent 10
                        this._gridState.producerStates[producerId].outputCommands = this._gridState.producerStates[producerId].outputCommands.concat(commands);
                        this._gridState.producerStates[producerId].outputCommands = this._gridState.producerStates[producerId].outputCommands.slice(-10);

                        // Notify any local subscribers of the producer updates
                        this.updateProducerSubscribers();
                    }
                }
            }
        }
    }

    /**
     * Update the managers for the consumers.
     */
    private async updateConsumerManagers(): Promise<void> {
        // Create some dummy usage data for the consumers every 10s
        // In a real life scenario this would come from the consumers meter
        // and at an interval of the implementers choice
        if (this._consumerManagers) {
            for (const consumerId in this._consumerManagers) {
                // Range the source output from 0 to 10
                const usageCommand = await this._consumerManagers[consumerId].sendUsageCommand(this._gridState.secondsCounter, Math.random() * 10);
                // Add the usage to the local state and keep just the most recent 10
                this._gridState.consumerStates[consumerId].usageCommands.push(usageCommand);
                this._gridState.consumerStates[consumerId].usageCommands = this._gridState.consumerStates[consumerId].usageCommands.slice(-10);
            }

            // Notify any local subscribers of the consumer updates
            this.updateConsumerSubscribers();
        }
    }
}
