import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IGrid } from "../models/api/IGrid";
import { IDemoConsumerState } from "../models/services/IDemoConsumerState";
import { IDemoGridState } from "../models/services/IDemoGridState";
import { IDemoProducerState } from "../models/services/IDemoProducerState";
import { LocalStorageService } from "./localStorageService";

/**
 * DemoGridManager Class.
 */
export class DemoGridManager {
    /**
     * The id of the loaded grid.
     */
    private _gridId?: string;

    /**
     * The state of the grid.
     */
    private _gridState?: IDemoGridState;

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
     */
    constructor() {
        this._subscriptionsGrid = {};
        this._subscriptionsProducer = {};
        this._subscriptionsConsumer = {};
    }

    /**
     * Load the state from the grid.
     * @param grid The grid to populate from.
     */
    public async load(grid: IGrid): Promise<void> {
        const localStorageService = ServiceFactory.get<LocalStorageService>("localStorage");

        let newState;
        if (this._gridId !== grid.id) {
            // It is a different grid to the current loaded state
            // so load it and trigger subscriptions
            // See if we have the grid state in local storage
            newState = await localStorageService.get<IDemoGridState>(grid.id);
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

        for (const id in this._subscriptionsGrid) {
            this._subscriptionsGrid[id](this._gridState);
        }

        for (const id in this._subscriptionsProducer) {
            this._subscriptionsProducer[id](this._gridState.producerStates[id]);
        }

        for (const id in this._subscriptionsConsumer) {
            this._subscriptionsConsumer[id](this._gridState.consumerStates[id]);
        }

        await localStorageService.set<IDemoGridState>(grid.id, this._gridState);
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
