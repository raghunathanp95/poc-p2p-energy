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
const client_load_balancer_1 = require("@iota/client-load-balancer");
const serviceFactory_1 = require("../factories/serviceFactory");
const trytesHelper_1 = require("../utils/trytesHelper");
/**
 * Service to handle the grid.
 */
class GridManager {
    /**
     * Create a new instance of GridService.
     * @param gridConfig The configuration for the grid.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for generating processing outputs, usage and payments.
     */
    constructor(gridConfig, loadBalancerSettings, strategy) {
        this._config = gridConfig;
        this._loadBalancerSettings = loadBalancerSettings;
        this._strategy = strategy;
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
     * Update strategy to process payments for registered entites.
     */
    updateStrategy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateConsumers();
            yield this.updateProducers();
        });
    }
    /**
     * Update the consumers using the strategy.
     */
    updateConsumers() {
        return __awaiter(this, void 0, void 0, function* () {
            // const consumerUsageStoreService = ServiceFactory.get<IStorageService<IConsumerUsage>>(
            //     "grid-consumer-usage-store");
            // const toRemove = [];
            // let pageSize = 10;
            // let page = 0;
            // let pageResponse;
            // do {
            //     pageResponse = await consumerUsageStoreService.page(undefined, page, pageSize);
            //     for (let i = 0; i < pageResponse.items.length; i++) {
            //         const consumerUsage: IConsumerUsage = pageResponse.items[i];
            //         if (consumerUsage.usage && consumerUsage.usage.length > 0) {
            //             let totalUsage = 0;
            //             for (let j = 0; j < consumerUsage.usage.length; j++) {
            //                 const consumerUsageUse = consumerUsage.usage[j];
            //                 totalUsage += consumerUsageUse.usage;
            //             }
            //             // No more unpaid entries so delete the producer output
            //             toRemove.push(consumerUsage.id);
            //         }
            //     }
            //     page++;
            //     pageSize = pageResponse.pageSize;
            // } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);
            // for (let i = 0; i < toRemove.length; i++) {
            //     await consumerUsageStoreService.remove(toRemove[i]);
            // }
            // await this._strategy.process();
        });
    }
    /**
     * Update the producers using the strategy.
     */
    updateProducers() {
        return __awaiter(this, void 0, void 0, function* () {
            // const producerOutputService = ServiceFactory.get<IStorageService<IProducerOutput>>(
            //     "grid-producer-output-store");
            // const producerOutputPaymentService = ServiceFactory.get<IStorageService<IProducerOutputPayment>>(
            //     "producer-output-payment");
            client_load_balancer_1.composeAPI(this._loadBalancerSettings);
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
            yield this._strategy.process();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUE4RTtBQUM5RSxnRUFBNkQ7QUFZN0Qsd0RBQXFEO0FBRXJEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBMEJwQjs7Ozs7T0FLRztJQUNILFlBQ0ksVUFBOEIsRUFDOUIsb0JBQTBDLEVBQzFDLFFBQXVCO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO1FBQzFCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7O09BRUc7SUFDSSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNVLFVBQVU7O1lBQ25CLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsU0FBUzs7WUFDbEIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLGNBQWMsQ0FBQyxZQUEyQixFQUFFLFFBQXVCOztZQUM1RSxNQUFNLDBCQUEwQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUNqRCw0QkFBNEIsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0seUJBQXlCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQ2hELDJCQUEyQixDQUFDLENBQUM7WUFFakMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUks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