import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { ServiceFactory } from "../factories/serviceFactory";
import { IGridConfiguration } from "../models/config/grid/IGridConfiguration";
import { IConsumerUsage } from "../models/db/grid/IConsumerUsage";
import { IProducerOutput } from "../models/db/grid/IProducerOutput";
import { IConsumerUsageCommand } from "../models/mam/IConsumerUsageCommand";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { IStorageService } from "../models/services/IStorageService";
import { IRegistration } from "../models/services/registration/IRegistration";
import { IGridManagerState } from "../models/state/IGridManagerState";
import { TrytesHelper } from "../utils/trytesHelper";

/**
 * Service to handle the grid.
 */
export class GridManager {
    /**
     * Configuration for the grid.
     */
    private readonly _config: IGridConfiguration;

    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings: LoadBalancerSettings;

    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The current state for the producer.
     */
    private _state?: IGridManagerState;

    /**
     * Create a new instance of GridService.
     * @param gridConfig The configuration for the grid.
     * @param loadBalancerSettings Load balancer settings for communications.
     */
    constructor(gridConfig: IGridConfiguration, loadBalancerSettings: LoadBalancerSettings) {
        this._config = gridConfig;
        this._loadBalancerSettings = loadBalancerSettings;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Get the state for the manager.
     */
    public getState(): IGridManagerState {
        return this._state;
    }

    /**
     * Initialise the grid.
     */
    public async initialise(): Promise<void> {
        await this.loadState();
        await this.saveState();
    }

    /**
     * Closedown the grid.
     */
    public async closedown(): Promise<void> {
        await this.saveState();
    }

    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    public async handleCommands(registration: IRegistration, commands: IMamCommand[]): Promise<void> {
        const producerOutputStoreService = ServiceFactory.get<IStorageService<IProducerOutput>>(
            "grid-producer-output-store");
        const consumerUsageStoreService = ServiceFactory.get<IStorageService<IConsumerUsage>>(
            "grid-consumer-usage-store");

        let updateStore = false;
        let producerStore;
        let consumerStore;

        if (registration.itemType === "producer") {
            producerStore = await producerOutputStoreService.get(`${this._config.id}/${registration.id}`);
        } else if (registration.itemType === "consumer") {
            consumerStore = await consumerUsageStoreService.get(`${this._config.id}/${registration.id}`);
        }

        for (let i = 0; i < commands.length; i++) {
            this._loggingService.log("grid", "Processing", commands[i]);
            if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                // This mam channel will have handled any mam operation
                // at the moment there is nothing else for use to do
            } else if (commands[i].command === "output" && registration.itemType === "producer") {
                const outputCommand = <IProducerOutputCommand>commands[i];

                if (!producerStore) {
                    producerStore = {
                        id: registration.id,
                        output: []
                    };
                }

                // Only store output commands that we havent already seen
                if (!producerStore.output.find(o => o.startTime === outputCommand.startTime)) {
                    producerStore.output.push({
                        startTime: outputCommand.startTime,
                        endTime: outputCommand.endTime,
                        output: outputCommand.output,
                        producerPrice: outputCommand.price,
                        paymentAddress: outputCommand.paymentAddress
                    });

                    updateStore = true;
                }
            } else if (commands[i].command === "usage" && registration.itemType === "consumer") {
                const outputCommand = <IConsumerUsageCommand>commands[i];

                if (!consumerStore) {
                    consumerStore = {
                        id: registration.id,
                        output: []
                    };
                }

                // Only store usage commands that we havent already seen
                if (!consumerStore.output.find(o => o.startTime === outputCommand.startTime)) {
                    consumerStore.output.push({
                        startTime: outputCommand.startTime,
                        endTime: outputCommand.endTime,
                        usage: outputCommand.usage
                    });

                    updateStore = true;
                }
            }
        }

        if (updateStore) {
            if (producerStore) {
                await producerOutputStoreService.set(`${this._config.id}/${registration.id}`, producerStore);
            }
            if (consumerStore) {
                await consumerUsageStoreService.set(`${this._config.id}/${registration.id}`, consumerStore);
            }
        }

        this._loggingService.log(
            "grid",
            `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`
        );
    }

    /**
     * Check if payments have been confirmed for producer outputs.
     */
    public async checkPayments(): Promise<void> {
        // const producerOutputService = ServiceFactory.get<IStorageService<IProducerOutput>>(
        //     "grid-producer-output-store");
        // const producerOutputPaymentService = ServiceFactory.get<IStorageService<IProducerOutputPayment>>(
        //     "producer-output-payment");

        composeAPI(this._loadBalancerSettings);

        // const iota = composeAPI({
        //     provider: this._nodeConfig.provider
        // });

        // const toRemove = [];

        // let pageSize = 10;
        // let page = 0;
        // let pageResponse;
        // do {
        //     pageResponse = await producerOutputService.page(undefined, page, pageSize);

        //     for (let i = 0; i < pageResponse.items.length; i++) {
        //         const producer: IProducerOutput = pageResponse.items[i];
        //         if (producer.output && producer.output.length > 0) {
        //             const unpaid = [];
        //             for (let j = 0; j < producer.output.length; j++) {
        //                 const producerOutput = producer.output[j];
        //                 if (producerOutput.gridActualPrice) {
        //                     this._loggingService.log(
        //                         "grid",
        //                         `Check payments for ${pageResponse.ids[i]} at ${producerOutput.startTime}`
        //                     );

        //                     const confirmedBalances = await iota.getBalances(
        //                         [producerOutput.paymentAddress],
        //                         100);

        //                     if (confirmedBalances &&
        //                         confirmedBalances.balances &&
        //                         confirmedBalances.balances.length > 0 &&
        //                         confirmedBalances.balances[0] === producerOutput.gridActualPrice) {
        //                         // The confirmed balance on the address matches the
        //                         // actual price the grid was requesting, so move the output to
        //                         // the paid archive
        //                         this._loggingService.log(
        //                             "grid",
        //                             `Payment for ${pageResponse.ids[i]} on address ${producerOutput} confirmed`
        //                         );

        //                         await producerOutputPaymentService.set(
        //                             `${producer.id}/${producerOutput.startTime}`,
        //                             {
        //                                 startTime: producerOutput.startTime,
        //                                 endTime: producerOutput.endTime,
        //                                 output: producerOutput.output,
        //                                 producerAskingPrice: producerOutput.producerAskingPrice,
        //                                 paymentAddress: producerOutput.paymentAddress,
        //                                 paymentBundles: []
        //                             });
        //                     } else {
        //                         unpaid.push(producerOutput);
        //                     }
        //                 } else {
        //                     unpaid.push(producerOutput);
        //                 }
        //             }
        //             if (unpaid.length === 0) {
        //                 // No more unpaid entries so delete the producer output
        //                 toRemove.push(producer.id);
        //             } else {
        //                 // There are still unpaid outputs so update the item and save it
        //                 producer.output = unpaid;
        //                 await producerOutputService.set(producer.id, producer);
        //             }
        //         }
        //     }
        //     page++;
        //     pageSize = pageResponse.pageSize;
        // } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);

        // for (let i = 0; i < toRemove.length; i++) {
        //     await producerOutputService.remove(toRemove[i]);
        // }
    }

    /**
     * Remove the state for the grid.
     */
    public async removeState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IGridManagerState>>(
            "grid-storage-manager-state");

        this._loggingService.log("grid", `Removing State`);
        await storageConfigService.remove(this._config.id);
        this._loggingService.log("grid", `Removing State Complete`);
    }

    /**
     * Load the state for the grid.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IGridManagerState>>(
            "grid-storage-manager-state");

        this._loggingService.log("grid", `Loading State`);
        this._state = await storageConfigService.get(this._config.id);
        this._loggingService.log("grid", `Loaded State`);

        this._state = this._state || {
            paymentSeed: TrytesHelper.generateHash(),
            runningCostsBalance: 0,
            producerPaidBalance: 0,
            producerOwedBalance: 0,
            consumerOwedBalance: 0,
            consumerReceivedBalance: 0
        };
    }

    /**
     * Store the state for the grid.
     */
    private async saveState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IGridManagerState>>(
            "grid-storage-manager-state");

        this._loggingService.log("grid", `Storing State`);
        await storageConfigService.set(this._config.id, this._state);
        this._loggingService.log("grid", `Storing State Complete`);
    }
}
