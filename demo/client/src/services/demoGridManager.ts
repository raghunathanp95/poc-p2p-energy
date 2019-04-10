import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { INodeConfiguration } from "p2p-energy-common/dist/models/config/INodeConfiguration";
import { IStorageService } from "p2p-energy-common/dist/models/services/IStorageService";
import { IGridManagerState } from "p2p-energy-common/dist/models/state/IGridManagerState";
import { IProducerManagerState } from "p2p-energy-common/dist/models/state/IProducerManagerState";
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
import { IRegistration } from "p2p-energy-common/dist/models/services/registration/IRegistration";

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
    private _gridState?: IDemoGridState;

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
    private _sourceManagers?: { [id: string]: SourceManager };

    /**
     * Timer used for updates.
     */
    private _updateTimer?: NodeJS.Timer;

    /**
     * Subscriptions to the grid state changes.
     */
    private readonly _subscriptionsGrid: { [id: string]: (state: IDemoGridState) => void };

    /**
     * Subscriptions to the producer state changes.
     */
    private readonly _subscriptionsProducer: { [id: string]: (state: IDemoProducerState) => void };

    /**
     * Subscriptions to the state changes.
     */
    private readonly _subscriptionsConsumer: { [id: string]: (state: IDemoConsumerState) => void };

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
    }

    /**
     * Load the state from the grid.
     * @param grid The grid to populate from.
     */
    public async load(grid: IGrid): Promise<void> {
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
            gridManagerState: undefined,
            runningCostsBalance: 0,
            producerPaidBalance: 0,
            producerOwedBalance: 0,
            consumerReceivedBalance: 0,
            consumerOwedBalance: 0,
            producerStates: {},
            consumerStates: {}
        };

        this.constructManagers(grid);

        if (this._gridState) {
            for (const id in this._subscriptionsGrid) {
                this._subscriptionsGrid[id](this._gridState);
            }

            for (const id in this._subscriptionsProducer) {
                this._subscriptionsProducer[id](this._gridState.producerStates[id]);
            }

            for (const id in this._subscriptionsConsumer) {
                this._subscriptionsConsumer[id](this._gridState.consumerStates[id]);
            }
            await this._demoGridStateStorageService.set(grid.id, this._gridState);
        }

        this.startUpdates();
    }

    /**
     * Subscribe to grid state changes.
     * @param id The id of the item to subscribe to.
     * @param callback The callback for the subscription.
     */
    public subscribeGrid(id: string, callback: (state: IDemoGridState) => void): void {
        this._subscriptionsGrid[id] = callback;
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
    public subscribeProducer(id: string, callback: (state: IDemoProducerState) => void): void {
        this._subscriptionsProducer[id] = callback;
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
    public subscribeConsumer(id: string, callback: (state: IDemoConsumerState) => void): void {
        this._subscriptionsConsumer[id] = callback;
    }

    /**
     * Unsubscribe from consumer state changes.
     * @param id The id of the grid to subscribe to.
     */
    public unsubscribeConsumer(id: string): void {
        delete this._subscriptionsConsumer[id];
    }

    /**
     * Get the current state of the grid
     * @returns The grid state.
     */
    public getGridState(): IDemoGridState | undefined {
        return this._gridState;
    }

    /**
     * Get the current state of a producer
     * @param id The id of the producer to get.
     * @returns The producer state.
     */
    public getProducerState(id: string): IDemoProducerState | undefined {
        return this._gridState && this._gridState.producerStates[id];
    }

    /**
     * Get the current state of a consumer
     * @param id The id of the consumer to get.
     * @returns The consumer state.
     */
    public getConsumerState(id: string): IDemoConsumerState | undefined {
        return this._gridState && this._gridState.consumerStates[id];
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
     */
    private async constructManagers(grid: IGrid): Promise<void> {
        this.initialiseServices(grid);

        if (!this._gridManager) {
            this._gridManager = new GridManager(this._nodeConfig);
            await this._gridManager.initialise();
        }

        this._producerManagers = this._producerManagers || {};
        // this._sourceManagers = this._sourceManagers || {};
        // this._consumerManagers = this._consumerManagers || {};

        for (let p = 0; p < grid.producers.length; p++) {
            const producer = grid.producers[p];

            if (!this._producerManagers[producer.id]) {
                this._producerManagers[producer.id] = new ProducerManager({ name: producer.name, id: producer.id }, this._nodeConfig);
                await this._producerManagers[producer.id].initialise();
            }

            // for (let s = 0; s < producer.sources.length; s++) {
            //     const source = producer.sources[s];

            //     if (!this._sourceManagers[source.id]) {
            //         this._sourceManagers[source.id] = new SourceManager({name: source.name, id: source.id, type: source.type}, this._nodeConfig);
            //     }
            // }
        }

        // for (let c = 0 ; c < grid.consumers.length; c++) {
        //     const consumer = grid.consumers[c];

        //     if (!this._consumerManagers[consumer.id]) {
        //         this._consumerManagers[consumer.id] = new ConsumerManager({name: consumer.name, id: consumer.id}, this._nodeConfig);
        //     }
        // }
    }

    /**
     * Update all the managers.
     */
    private async updateManagers(): Promise<void> {
    }

    /**
     * Initialise all the service required by the manangers.
     * @param grid Grid to create services for.
     */
    private initialiseServices(grid: IGrid): void {
        ServiceFactory.register(
            "grid-storage-manager-state",
            () => new BrowserStorageService<IGridManagerState>(`grid-manager/${grid.id}/config`));

        ServiceFactory.register(
            "producer-storage-manager-state",
            () => new BrowserStorageService<IProducerManagerState>(`producer-manager-state`));

        ServiceFactory.register(
            "registration-storage",
            () => new BrowserStorageService<IRegistration>(`registrations`));

        ServiceFactory.register(
            "producer-registration-management",
            () => new RegistrationManagementService(this._nodeConfig, (registration) => registration.itemType === "consumer"));

        ServiceFactory.register(
            "producer-registration",
            () => new DirectRegistrationService("producer-registration-management"));
    }

    // /**
    //  * Populate power data for the producer.
    //  */
    // private populatePowerData(): void {
    //     // Dummy data for now
    //     this.props.producer.powerSlices = [];
    //     if (this.props.producer.sources.length > 0) {
    //         for (let i = 0; i < this.props.producer.sources.length; i++) {
    //             const powerSlices = [];

    //             for (let k = 0; k < 10; k++) {
    //                 // tslint:disable-next-line:insecure-random
    //                 const powerSlice: IPowerSlice = { startTime: k, endTime: ((k + 1)) - 1, value: Math.random() * 180 };
    //                 powerSlices.push(powerSlice);

    //                 this.props.producer.powerSlices[k] = this.props.producer.powerSlices[k] || { startTime: k, endTime: ((k + 1)) - 1, value: 0 };
    //                 this.props.producer.powerSlices[k].value += powerSlice.value;
    //             }

    //             this.props.producer.sources[i].powerSlices = powerSlices;
    //         }
    //     }
    // }
}
