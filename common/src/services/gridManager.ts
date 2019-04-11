import { composeAPI } from "@iota/core";
import { ServiceFactory } from "../factories/serviceFactory";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IProducerOutput } from "../models/db/grid/IProducerOutput";
import { IProducerOutputPayment } from "../models/db/grid/IProducerOutputPayment";
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
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The current state for the producer.
     */
    private _state?: IGridManagerState;

    /**
     * Node configuration.
     */
    private readonly _nodeConfig?: INodeConfiguration;

    /**
     * Create a new instance of GridService.
     * @param nodeConfig Configuration for tangle communication.
     */
    constructor(nodeConfig: INodeConfiguration) {
        this._nodeConfig = nodeConfig;
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
        const producerOutputService = ServiceFactory.get<IStorageService<IProducerOutput>>("producer-output");
        let store = await producerOutputService.get(registration.id);
        let updatedStore = false;

        for (let i = 0; i < commands.length; i++) {
            this._loggingService.log("grid", "Processing", commands[i]);
            if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                // This mam channel will have handled any mam operation
                // at the moment there is nothing else for use to do
            } else if (commands[i].command === "output") {
                const outputCommand = <IProducerOutputCommand>commands[i];

                if (!store) {
                    store = {
                        id: registration.id,
                        output: []
                    };
                }

                // Only store output commands that we havent already seen
                if (!store.output.find(o => o.startTime === outputCommand.startTime)) {
                    store.output.push({
                        startTime: outputCommand.startTime,
                        endTime: outputCommand.endTime,
                        output: outputCommand.output,
                        producerAskingPrice: outputCommand.askingPrice,
                        paymentAddress: outputCommand.paymentAddress
                    });

                    updatedStore = true;
                }
            }
        }

        if (updatedStore) {
            await producerOutputService.set(registration.id, store);
        }

        this._loggingService.log(
            "grid",
            `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`
        );
    }

    /**
     * Check if payments have been confirmed for producer outputs.
     * @param calculatePrice Calculate a price based on the output details and asking price.
     */
    public async calculateAskingPrices(
        calculatePrice: (startTime: number, endTime: number, output: number, askingPrice: number) => number):
        Promise<void> {
        const producerOutputService = ServiceFactory.get<IStorageService<IProducerOutput>>("producer-output");

        let pageSize = 10;
        let page = 0;
        let pageResponse;
        do {
            pageResponse = await producerOutputService.page(undefined, page, pageSize);

            for (let i = 0; i < pageResponse.items.length; i++) {
                const producer: IProducerOutput = pageResponse.items[i];
                if (producer.output && producer.output.length > 0) {
                    let updated = false;

                    for (let j = 0; j < producer.output.length; j++) {
                        const producerOutput = producer.output[j];
                        if (!producerOutput.gridActualPrice) {
                            this._loggingService.log(
                                "grid",
                                `Calculate price for ${pageResponse.ids[i]} at ${producerOutput.startTime}`
                            );
                            updated = true;
                            producerOutput.gridActualPrice = calculatePrice(
                                producerOutput.startTime,
                                producerOutput.endTime,
                                producerOutput.output,
                                producerOutput.producerAskingPrice);
                        }
                    }
                    if (updated) {
                        await producerOutputService.set(producer.id, producer);
                    }
                }
            }
            page++;
            pageSize = pageResponse.pageSize;
        } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);
    }

    /**
     * Check if payments have been confirmed for producer outputs.
     */
    public async checkPayments(): Promise<void> {
        const producerOutputService = ServiceFactory.get<IStorageService<IProducerOutput>>("producer-output");
        const producerOutputPaymentService = ServiceFactory.get<IStorageService<IProducerOutputPayment>>(
            "producer-output-payment");

        const iota = composeAPI({
            provider: this._nodeConfig.provider
        });

        const toRemove = [];

        let pageSize = 10;
        let page = 0;
        let pageResponse;
        do {
            pageResponse = await producerOutputService.page(undefined, page, pageSize);

            for (let i = 0; i < pageResponse.items.length; i++) {
                const producer: IProducerOutput = pageResponse.items[i];
                if (producer.output && producer.output.length > 0) {
                    const unpaid = [];
                    for (let j = 0; j < producer.output.length; j++) {
                        const producerOutput = producer.output[j];
                        if (producerOutput.gridActualPrice) {
                            this._loggingService.log(
                                "grid",
                                `Check payments for ${pageResponse.ids[i]} at ${producerOutput.startTime}`
                            );

                            const confirmedBalances = await iota.getBalances(
                                [producerOutput.paymentAddress],
                                100);

                            if (confirmedBalances &&
                                confirmedBalances.balances &&
                                confirmedBalances.balances.length > 0 &&
                                confirmedBalances.balances[0] === producerOutput.gridActualPrice) {
                                // The confirmed balance on the address matches the
                                // actual price the grid was requesting, so move the output to
                                // the paid archive
                                this._loggingService.log(
                                    "grid",
                                    `Payment for ${pageResponse.ids[i]} on address ${producerOutput} confirmed`
                                );

                                await producerOutputPaymentService.set(
                                    `${producer.id}/${producerOutput.startTime}`,
                                    {
                                        startTime: producerOutput.startTime,
                                        endTime: producerOutput.endTime,
                                        output: producerOutput.output,
                                        producerAskingPrice: producerOutput.producerAskingPrice,
                                        paymentAddress: producerOutput.paymentAddress,
                                        paymentBundles: []
                                    });
                            } else {
                                unpaid.push(producerOutput);
                            }
                        } else {
                            unpaid.push(producerOutput);
                        }
                    }
                    if (unpaid.length === 0) {
                        // No more unpaid entries so delete the producer output
                        toRemove.push(producer.id);
                    } else {
                        // There are still unpaid outputs so update the item and save it
                        producer.output = unpaid;
                        await producerOutputService.set(producer.id, producer);
                    }
                }
            }
            page++;
            pageSize = pageResponse.pageSize;
        } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);

        for (let i = 0; i < toRemove.length; i++) {
            await producerOutputService.remove(toRemove[i]);
        }
    }

    /**
     * Load the state for the grid.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IGridManagerState>>(
            "grid-storage-manager-state");

        this._loggingService.log("grid", `Loading State`);
        this._state = await storageConfigService.get(`state`);
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
        await storageConfigService.set("state", this._state);
        this._loggingService.log("grid", `Storing State Complete`);
    }
}
