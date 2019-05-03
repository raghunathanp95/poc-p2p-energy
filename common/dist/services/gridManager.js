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
     */
    constructor(gridConfig, loadBalancerSettings) {
        this._config = gridConfig;
        this._loadBalancerSettings = loadBalancerSettings;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUE4RTtBQUM5RSxnRUFBNkQ7QUFXN0Qsd0RBQXFEO0FBRXJEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBcUJwQjs7OztPQUlHO0lBQ0gsWUFBWSxVQUE4QixFQUFFLG9CQUEwQztRQUNsRixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztRQUMxQixJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7O09BRUc7SUFDVSxVQUFVOztZQUNuQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFNBQVM7O1lBQ2xCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxjQUFjLENBQUMsWUFBMkIsRUFBRSxRQUF1Qjs7WUFDNUUsTUFBTSwwQkFBMEIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDakQsNEJBQTRCLENBQUMsQ0FBQztZQUNsQyxNQUFNLHlCQUF5QixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUNoRCwyQkFBMkIsQ0FBQyxDQUFDO1lBRWpDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLGFBQWEsQ0FBQztZQUNsQixJQUFJLGFBQWEsQ0FBQztZQUVsQixJQUFJLFlBQVksQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO2dCQUN0QyxhQUFhLEdBQUcsTUFBTSwwQkFBMEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNqRztpQkFBTSxJQUFJLFlBQVksQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO2dCQUM3QyxhQUFhLEdBQUcsTUFBTSx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNoRztZQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO29CQUN0RSx1REFBdUQ7b0JBQ3ZELG9EQUFvRDtpQkFDdkQ7cUJBQU0sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsSUFBSSxZQUFZLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtvQkFDakYsTUFBTSxhQUFhLEdBQTJCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFMUQsSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDaEIsYUFBYSxHQUFHOzRCQUNaLEVBQUUsRUFBRSxZQUFZLENBQUMsRUFBRTs0QkFDbkIsTUFBTSxFQUFFLEVBQUU7eUJBQ2IsQ0FBQztxQkFDTDtvQkFFRCx5REFBeUQ7b0JBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO3dCQUMxRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzs0QkFDdEIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTOzRCQUNsQyxPQUFPLEVBQUUsYUFBYSxDQUFDLE9BQU87NEJBQzlCLE1BQU0sRUFBRSxhQUFhLENBQUMsTUFBTTs0QkFDNUIsYUFBYSxFQUFFLGFBQWEsQ0FBQyxLQUFLOzRCQUNsQyxjQUFjLEVBQUUsYUFBYSxDQUFDLGNBQWM7eUJBQy9DLENBQUMsQ0FBQzt3QkFFSCxXQUFXLEdBQUcsSUFBSSxDQUFDO3FCQUN0QjtpQkFDSjtxQkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLFlBQVksQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO29CQUNoRixNQUFNLGFBQWEsR0FBMEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV6RCxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUNoQixhQUFhLEdBQUc7NEJBQ1osRUFBRSxFQUFFLFlBQVksQ0FBQyxFQUFFOzRCQUNuQixNQUFNLEVBQUUsRUFBRTt5QkFDYixDQUFDO3FCQUNMO29CQUVELHdEQUF3RDtvQkFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQzFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDOzRCQUN0QixTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7NEJBQ2xDLE9BQU8sRUFBRSxhQUFhLENBQUMsT0FBTzs0QkFDOUIsS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLO3lCQUM3QixDQUFDLENBQUM7d0JBRUgsV0FBVyxHQUFHLElBQUksQ0FBQztxQkFDdEI7aUJBQ0o7YUFDSjtZQUVELElBQUksV0FBVyxFQUFFO2dCQUNiLElBQUksYUFBYSxFQUFFO29CQUNmLE1BQU0sMEJBQTBCLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2lCQUNoRztnQkFDRCxJQUFJLGFBQWEsRUFBRTtvQkFDZixNQUFNLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztpQkFDL0Y7YUFDSjtZQUVELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUNwQixNQUFNLEVBQ04sYUFBYSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLFlBQVksQ0FBQyxRQUFRLEdBQUcsQ0FDeEYsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsYUFBYTs7WUFDdEIsc0ZBQXNGO1lBQ3RGLHFDQUFxQztZQUNyQyxvR0FBb0c7WUFDcEcsa0NBQWtDO1lBRWxDLGlDQUFVLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFdkMsNEJBQTRCO1lBQzVCLDBDQUEwQztZQUMxQyxNQUFNO1lBRU4sdUJBQXVCO1lBRXZCLHFCQUFxQjtZQUNyQixnQkFBZ0I7WUFDaEIsb0JBQW9CO1lBQ3BCLE9BQU87WUFDUCxrRkFBa0Y7WUFFbEYsNERBQTREO1lBQzVELG1FQUFtRTtZQUNuRSwrREFBK0Q7WUFDL0QsaUNBQWlDO1lBQ2pDLGlFQUFpRTtZQUNqRSw2REFBNkQ7WUFDN0Qsd0RBQXdEO1lBQ3hELGdEQUFnRDtZQUNoRCxrQ0FBa0M7WUFDbEMscUdBQXFHO1lBQ3JHLHlCQUF5QjtZQUV6Qix3RUFBd0U7WUFDeEUsMkRBQTJEO1lBQzNELGdDQUFnQztZQUVoQywrQ0FBK0M7WUFDL0Msd0RBQXdEO1lBQ3hELG1FQUFtRTtZQUNuRSw4RkFBOEY7WUFDOUYsOEVBQThFO1lBQzlFLHlGQUF5RjtZQUN6Riw4Q0FBOEM7WUFDOUMsb0RBQW9EO1lBQ3BELHNDQUFzQztZQUN0QywwR0FBMEc7WUFDMUcsNkJBQTZCO1lBRTdCLGtFQUFrRTtZQUNsRSw0RUFBNEU7WUFDNUUsZ0NBQWdDO1lBQ2hDLHVFQUF1RTtZQUN2RSxtRUFBbUU7WUFDbkUsaUVBQWlFO1lBQ2pFLDJGQUEyRjtZQUMzRixpRkFBaUY7WUFDakYscURBQXFEO1lBQ3JELGtDQUFrQztZQUNsQywrQkFBK0I7WUFDL0IsdURBQXVEO1lBQ3ZELHdCQUF3QjtZQUN4QiwyQkFBMkI7WUFDM0IsbURBQW1EO1lBQ25ELG9CQUFvQjtZQUNwQixnQkFBZ0I7WUFDaEIseUNBQXlDO1lBQ3pDLDBFQUEwRTtZQUMxRSw4Q0FBOEM7WUFDOUMsdUJBQXVCO1lBQ3ZCLG1GQUFtRjtZQUNuRiw0Q0FBNEM7WUFDNUMsMEVBQTBFO1lBQzFFLGdCQUFnQjtZQUNoQixZQUFZO1lBQ1osUUFBUTtZQUNSLGNBQWM7WUFDZCx3Q0FBd0M7WUFDeEMsNkVBQTZFO1lBRTdFLDhDQUE4QztZQUM5Qyx1REFBdUQ7WUFDdkQsSUFBSTtRQUNSLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsV0FBVzs7WUFDcEIsTUFBTSxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDM0MsNEJBQTRCLENBQUMsQ0FBQztZQUVsQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNuRCxNQUFNLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1csU0FBUzs7WUFDbkIsTUFBTSxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDM0MsNEJBQTRCLENBQUMsQ0FBQztZQUVsQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVqRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUk7Z0JBQ3pCLFdBQVcsRUFBRSwyQkFBWSxDQUFDLFlBQVksRUFBRTtnQkFDeEMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsdUJBQXVCLEVBQUUsQ0FBQzthQUM3QixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVyxTQUFTOztZQUNuQixNQUFNLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUMzQyw0QkFBNEIsQ0FBQyxDQUFDO1lBRWxDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNsRCxNQUFNLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDL0QsQ0FBQztLQUFBO0NBQ0o7QUEvUUQsa0NBK1FDIn0=