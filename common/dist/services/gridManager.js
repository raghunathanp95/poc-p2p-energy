"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@iota/core");
const serviceFactory_1 = require("../factories/serviceFactory");
const trytesHelper_1 = require("../utils/trytesHelper");
/**
 * Service to handle the grid.
 */
class GridManager {
    /**
     * Create a new instance of GridService.
     * @param nodeConfig Configuration for tangle communication.
     */
    constructor(gridConfig, nodeConfig) {
        this._config = gridConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
    }
    /**
     * Get the state for the manager.
     */
    getState() {
        return this._state;
    }
    /**
     * Initialise the grid.
     */
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            yield this.saveState();
        });
    }
    /**
     * Closedown the grid.
     */
    closedown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveState();
        });
    }
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    handleCommands(registration, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            const producerOutputStoreService = serviceFactory_1.ServiceFactory.get("grid-producer-output-store");
            const consumerUsageStoreService = serviceFactory_1.ServiceFactory.get("grid-consumer-usage-store");
            let updateStore = false;
            let producerStore;
            let consumerStore;
            if (registration.itemType === "producer") {
                producerStore = yield producerOutputStoreService.get(`${this._config.id}/${registration.id}`);
            }
            else if (registration.itemType === "consumer") {
                consumerStore = yield consumerUsageStoreService.get(`${this._config.id}/${registration.id}`);
            }
            for (let i = 0; i < commands.length; i++) {
                this._loggingService.log("grid", "Processing", commands[i]);
                if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                    // This mam channel will have handled any mam operation
                    // at the moment there is nothing else for use to do
                }
                else if (commands[i].command === "output" && registration.itemType === "producer") {
                    const outputCommand = commands[i];
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
                }
                else if (commands[i].command === "usage" && registration.itemType === "consumer") {
                    const outputCommand = commands[i];
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
                    yield producerOutputStoreService.set(`${this._config.id}/${registration.id}`, producerStore);
                }
                if (consumerStore) {
                    yield consumerUsageStoreService.set(`${this._config.id}/${registration.id}`, consumerStore);
                }
            }
            this._loggingService.log("grid", `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`);
        });
    }
    /**
     * Check if payments have been confirmed for producer outputs.
     */
    checkPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            // const producerOutputService = ServiceFactory.get<IStorageService<IProducerOutput>>(
            //     "grid-producer-output-store");
            // const producerOutputPaymentService = ServiceFactory.get<IStorageService<IProducerOutputPayment>>(
            //     "producer-output-payment");
            core_1.composeAPI({
                provider: this._nodeConfig.provider
            });
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
        });
    }
    /**
     * Remove the state for the grid.
     */
    removeState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("grid-storage-manager-state");
            this._loggingService.log("grid", `Removing State`);
            yield storageConfigService.remove(this._config.id);
            this._loggingService.log("grid", `Removing State Complete`);
        });
    }
    /**
     * Load the state for the grid.
     */
    loadState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("grid-storage-manager-state");
            this._loggingService.log("grid", `Loading State`);
            this._state = yield storageConfigService.get(this._config.id);
            this._loggingService.log("grid", `Loaded State`);
            this._state = this._state || {
                paymentSeed: trytesHelper_1.TrytesHelper.generateHash(),
                runningCostsBalance: 0,
                producerPaidBalance: 0,
                producerOwedBalance: 0,
                consumerOwedBalance: 0,
                consumerReceivedBalance: 0
            };
        });
    }
    /**
     * Store the state for the grid.
     */
    saveState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("grid-storage-manager-state");
            this._loggingService.log("grid", `Storing State`);
            yield storageConfigService.set(this._config.id, this._state);
            this._loggingService.log("grid", `Storing State Complete`);
        });
    }
}
exports.GridManager = GridManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFDQUF3QztBQUN4QyxnRUFBNkQ7QUFZN0Qsd0RBQXFEO0FBRXJEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBcUJwQjs7O09BR0c7SUFDSCxZQUFZLFVBQThCLEVBQUUsVUFBOEI7UUFDdEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7O09BRUc7SUFDVSxVQUFVOztZQUNuQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFNBQVM7O1lBQ2xCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxjQUFjLENBQUMsWUFBMkIsRUFBRSxRQUF1Qjs7WUFDNUUsTUFBTSwwQkFBMEIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDakQsNEJBQTRCLENBQUMsQ0FBQztZQUNsQyxNQUFNLHlCQUF5QixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUNoRCwyQkFBMkIsQ0FBQyxDQUFDO1lBRWpDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLGFBQWEsQ0FBQztZQUNsQixJQUFJLGFBQWEsQ0FBQztZQUVsQixJQUFJLFlBQVksQ0FBQyxRQUFR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