import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { INodeConfiguration } from "p2p-energy-common/dist/models/config/INodeConfiguration";
import { ISourceStore } from "p2p-energy-common/dist/models/db/producer/ISourceStore";
import { IMamCommand } from "p2p-energy-common/dist/models/mam/IMamCommand";
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
     * The node configuration.
     */
    private _nodeConfig: INodeConfiguration;

    /**
     * The demo grid storage service.
     */
    private _demoGridStateStorageService: IStorageService<IDemoGridState>;

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
     * Counter for the update loop.
     */
    private _updateCounter: number;

    /**
     * Create a new instance of DemoGridManager.
     * @param nodeConfig The configuration for accessing the tangle.
     */
    constructor(nodeConfig: INodeConfiguration) {
        this._nodeConfig = nodeConfig;

        this._demoGridStateStorageService = ServiceFactory.get<IStorageService<IDemoGridState>>("demo-grid-state-storage");
        this._subscriptionsGrid = {};
        this._subscriptionsProducer = {};
        this._subscriptionsConsumer = {};
        this._subscriptionsSource = {};
        this._gridState = {
            producerStates: {},
            consumerStates: {},
            sourceStates: {}
        };

        this._updateCounter = 0;
    }

    /**
     * Load the state from the grid.
     * @param grid The grid to populate from.
     * @param progressCallback Send callback messages.
     */
    public async load(grid: IGrid, progressCallback: (status: string) => void): Promise<void> {
        this.stopUpdates();

        let newState;
        if (this._gridId !== grid.id) {
            this.clearManagers();
            // It is a different grid to the current loaded state
            // so load it and trigger subscriptions
            // See if we have the grid state in local storage
            newState = await this._demoGridStateStorageService.get(grid.id);
        } else {
            newState = this._gridState;
        }

        this._gridId = grid.id;
        this._gridState = newState || {
            producerStates: {},
            consumerStates: {},
            sourceStates: {}
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
     * Subscribe to grid state changes.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeGrid(id: string, callback: (state: IDemoGridState | undefined) => void): void {
        this._subscriptionsGrid[id] = callback;
        callback(this.getGridState());
    }

    /**
     * Unsubscribe from grid state changes.
     * @param id The id of the grid to subscribe to.
     */
    public unsubscribeGrid(id: string): void {
        delete this._subscriptionsGrid[id];
    }

    /**
     * Subscribe to producer state changes.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeProducer(id: string, callback: (state: IDemoProducerState | undefined) => void): void {
        this._subscriptionsProducer[id] = callback;
        callback(this.getProducerState(id));
    }

    /**
     * Unsubscribe from producer state changes.
     * @param id The id of the grid to subscribe to.
     */
    public unsubscribeProducer(id: string): void {
        delete this._subscriptionsProducer[id];
    }

    /**
     * Subscribe to consumer state changes.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeConsumer(id: string, callback: (state: IDemoConsumerState | undefined) => void): void {
        this._subscriptionsConsumer[id] = callback;
        callback(this.getConsumerState(id));
    }

    /**
     * Unsubscribe from consumer state changes.
     * @param id The id of the consumer to unsubscribe.
     */
    public unsubscribeConsumer(id: string): void {
        delete this._subscriptionsConsumer[id];
    }

    /**
     * Subscribe to source state changes.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeSource(id: string, callback: (state: IDemoSourceState | undefined) => void): void {
        this._subscriptionsSource[id] = callback;
        callback(this.getSourceState(id));
    }

    /**
     * Unsubscribe from source state changes.
     * @param id The id of the source to unsubscribe from.
     */
    public unsubscribeSource(id: string): void {
        delete this._subscriptionsSource[id];
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
        for (const id in this._subscriptionsGrid) {
            this._subscriptionsGrid[id](this.getGridState());
        }
    }

    /**
     * Update the subscribers for the producers.
     */
    private updateProducerSubscribers(): void {
        for (const id in this._subscriptionsProducer) {
            this._subscriptionsProducer[id](this.getProducerState(id));
        }
    }

    /**
     * Update the subscribers for the consumers.
     */
    private updateConsumerSubscribers(): void {
        for (const id in this._subscriptionsConsumer) {
            this._subscriptionsConsumer[id](this.getConsumerState(id));
        }
    }

    /**
     * Update the subscribers for the sources.
     */
    private updateSourceSubscribers(): void {
        for (const id in this._subscriptionsSource) {
            this._subscriptionsSource[id](this.getSourceState(id));
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
            () => new RegistrationManagementService(this._nodeConfig, (registration) => registration.itemType === "consumer"));

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
            this._gridManager = new GridManager({ name: grid.name, id: grid.id }, this._nodeConfig);
            await this._gridManager.initialise();
        }

        this._producerManagers = this._producerManagers || {};
        this._sourceManagers = this._sourceManagers || {};
        this._consumerManagers = this._consumerManagers || {};

        for (let p = 0; p < grid.producers.length; p++) {
            const producer = grid.producers[p];

            progressCallback(`Initializing Producer '${producer.name}' [${producer.id}].`);
            if (!this._producerManagers[producer.id]) {
                this._producerManagers[producer.id] = new ProducerManager({ name: producer.name, id: producer.id }, this._nodeConfig);
                await this._producerManagers[producer.id].initialise();
            }

            this._gridState.producerStates[producer.id] = this._gridState.producerStates[producer.id] || {};

            for (let s = 0; s < producer.sources.length; s++) {
                const source = producer.sources[s];

                progressCallback(`Initializing Source '${source.name}' [${source.id}].`);
                if (!this._sourceManagers[source.id]) {
                    this._sourceManagers[source.id] = {
                        producerId: producer.id,
                        sourceManager: new SourceManager({ name: source.name, id: source.id, type: source.type }, this._nodeConfig)
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
                this._consumerManagers[consumer.id] = new ConsumerManager({ name: consumer.name, id: consumer.id }, this._nodeConfig);
                await this._consumerManagers[consumer.id].initialise();
            }

            this._gridState.consumerStates[consumer.id] = this._gridState.consumerStates[consumer.id] || {};
        }
    }

    /**
     * Update all the managers.
     */
    private async updateManagers(): Promise<void> {
        if (this._gridId) {
            const registrationManagementService = ServiceFactory.get<IRegistrationManagementService>("registration-management");
            await registrationManagementService.pollCommands(async (registration: IRegistration, commands: IMamCommand[]) => {
                // Producers and consumers and registered with the grid, so hand the commands to the grid manager
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

            // tslint:disable:insecure-random
            // Add a new source value every minute
            if (this._sourceManagers && this._updateCounter % 1 === 0) {
                for (const sourceId in this._sourceManagers) {
                    // Range the source output from 0 to 1000
                    const outputCommand = await this._sourceManagers[sourceId].sourceManager.sendOutputCommand(this._updateCounter * 10, Math.random() * 1000);

                    this._gridState.sourceStates[sourceId].outputCommands.push(outputCommand);
                    this._gridState.sourceStates[sourceId].outputCommands = this._gridState.sourceStates[sourceId].outputCommands.slice(-10);
                }
                this.updateSourceSubscribers();
            }

            this._updateCounter++;
            await this._demoGridStateStorageService.set(this._gridId, this._gridState);
        }
    }
}
