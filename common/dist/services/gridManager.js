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
            yield this.saveState();
        });
    }
    /**
     * Update the consumers using the strategy.
     */
    updateConsumers() {
        return __awaiter(this, void 0, void 0, function* () {
            const consumerUsageStoreService = serviceFactory_1.ServiceFactory.get("grid-consumer-usage-store");
            const toRemove = [];
            const consumerUsageById = {};
            let pageSize = 10;
            let page = 0;
            let pageResponse;
            do {
                pageResponse = yield consumerUsageStoreService.page(undefined, page, pageSize);
                for (let i = 0; i < pageResponse.items.length; i++) {
                    const consumerUsage = pageResponse.items[i];
                    if (consumerUsage.usage && consumerUsage.usage.length > 0) {
                        if (!consumerUsageById[consumerUsage.id]) {
                            consumerUsageById[consumerUsage.id] = [];
                        }
                        consumerUsageById[consumerUsage.id] =
                            consumerUsageById[consumerUsage.id].concat(consumerUsage.usage);
                    }
                    toRemove.push(consumerUsage.id);
                }
                page++;
                pageSize = pageResponse.pageSize;
            } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);
            for (let i = 0; i < toRemove.length; i++) {
                yield consumerUsageStoreService.remove(toRemove[i]);
            }
            yield this._strategy.consumers(consumerUsageById, this._state);
        });
    }
    /**
     * Update the producers using the strategy.
     */
    updateProducers() {
        return __awaiter(this, void 0, void 0, function* () {
            const producerOutputService = serviceFactory_1.ServiceFactory.get("grid-producer-output-store");
            const toRemove = [];
            const producerOutputById = {};
            let pageSize = 10;
            let page = 0;
            let pageResponse;
            do {
                pageResponse = yield producerOutputService.page(undefined, page, pageSize);
                for (let i = 0; i < pageResponse.items.length; i++) {
                    const producer = pageResponse.items[i];
                    if (producer.output && producer.output.length > 0) {
                        if (!producerOutputById[producer.id]) {
                            producerOutputById[producer.id] = [];
                        }
                        producerOutputById[producer.id] = producerOutputById[producer.id].concat(producer.output);
                    }
                    toRemove.push(producer.id);
                }
                page++;
                pageSize = pageResponse.pageSize;
            } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);
            for (let i = 0; i < toRemove.length; i++) {
                yield producerOutputService.remove(toRemove[i]);
            }
            yield this._strategy.producers(producerOutputById, this._state);
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
                strategyState: yield this._strategy.init()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGdFQUE2RDtBQWM3RCx3REFBcUQ7QUFFckQ7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUEyQnBCOzs7OztPQUtHO0lBQ0gsWUFDSSxVQUE4QixFQUM5QixvQkFBMEMsRUFDMUMsUUFBMEI7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7UUFDMUIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ1UsVUFBVTs7WUFDbkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVSxTQUFTOztZQUNsQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsY0FBYyxDQUFDLFlBQTJCLEVBQUUsUUFBdUI7O1lBQzVFLE1BQU0sMEJBQTBCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQ2pELDRCQUE0QixDQUFDLENBQUM7WUFDbEMsTUFBTSx5QkFBeUIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDaEQsMkJBQTJCLENBQUMsQ0FBQztZQUVqQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDeEIsSUFBSSxhQUFhLENBQUM7WUFDbEIsSUFBSSxhQUFhLENBQUM7WUFFbEIsSUFBSSxZQUFZLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFDdEMsYUFBYSxHQUFHLE1BQU0sMEJBQTBCLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDakc7aUJBQU0sSUFBSSxZQUFZLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFDN0MsYUFBYSxHQUFHLE1BQU0seUJBQXlCLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDaEc7WUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtvQkFDdEUsdURBQXVEO29CQUN2RCxvREFBb0Q7aUJBQ3ZEO3FCQUFNLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxRQUFRLElBQUksWUFBWSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7b0JBQ2pGLE1BQU0sYUFBYSxHQUEyQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTFELElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ2hCLGFBQWEsR0FBRzs0QkFDWixFQUFFLEVBQUUsWUFBWSxDQUFDLEVBQUU7NEJBQ25CLE1BQU0sRUFBRSxFQUFFO3lCQUNiLENBQUM7cUJBQ0w7b0JBRUQseURBQXlEO29CQUN6RCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDMUUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7NEJBQ3RCLFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUzs0QkFDbEMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxPQUFPOzRCQUM5QixNQUFNLEVBQUUsYUFBYSxDQUFDLE1BQU07NEJBQzVCLGFBQWEsRUFBRSxhQUFhLENBQUMsS0FBSzs0QkFDbEMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxjQUFjO3lCQUMvQyxDQUFDLENBQUM7d0JBRUgsV0FBVyxHQUFHLElBQUksQ0FBQztxQkFDdEI7aUJBQ0o7cUJBQU0sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sSUFBSSxZQUFZLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtvQkFDaEYsTUFBTSxhQUFhLEdBQTBCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFekQsSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDaEIsYUFBYSxHQUFHOzRCQUNaLEVBQUUsRUFBRSxZQUFZLENBQUMsRUFBRTs0QkFDbkIsTUFBTSxFQUFFLEVBQUU7eUJBQ2IsQ0FBQztxQkFDTDtvQkFFRCx3REFBd0Q7b0JBQ3hELElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO3dCQUMxRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzs0QkFDdEIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTOzRCQUNsQyxPQUFPLEVBQUUsYUFBYSxDQUFDLE9BQU87NEJBQzlCLEtBQUssRUFBRSxhQUFhLENBQUMsS0FBSzt5QkFDN0IsQ0FBQyxDQUFDO3dCQUVILFdBQVcsR0FBRyxJQUFJLENBQUM7cUJBQ3RCO2lCQUNKO2FBQ0o7WUFFRCxJQUFJLFdBQVcsRUFBRTtnQkFDYixJQUFJLGFBQWEsRUFBRTtvQkFDZixNQUFNLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztpQkFDaEc7Z0JBQ0QsSUFBSSxhQUFhLEVBQUU7b0JBQ2YsTUFBTSx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7aUJBQy9GO2FBQ0o7WUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FDcEIsTUFBTSxFQUNOLGFBQWEsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixZQUFZLENBQUMsUUFBUSxHQUFHLENBQ3hGLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLGNBQWM7O1lBQ3ZCLE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzdCLE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzdCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsZUFBZTs7WUFDeEIsTUFBTSx5QkFBeUIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDaEQsMkJBQTJCLENBQUMsQ0FBQztZQUVqQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDcEIsTUFBTSxpQkFBaUIsR0FBNEMsRUFBRSxDQUFDO1lBRXRFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLFlBQVksQ0FBQztZQUNqQixHQUFHO2dCQUNDLFlBQVksR0FBRyxNQUFNLHlCQUF5QixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUUvRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2hELE1BQU0sYUFBYSxHQUFtQixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxJQUFJLGFBQWEsQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUN2RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFOzRCQUN0QyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO3lCQUM1Qzt3QkFDRCxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDOzRCQUMvQixpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDdkU7b0JBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRSxDQUFDO2dCQUNQLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO2FBQ3BDLFFBQVEsWUFBWSxJQUFJLFlBQVksQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBRTFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN0QyxNQUFNLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2RDtZQUVELE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsZUFBZTs7WUFDeEIsTUFBTSxxQkFBcUIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDNUMsNEJBQTRCLENBQUMsQ0FBQztZQUVsQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDcEIsTUFBTSxrQkFBa0IsR0FBNkMsRUFBRSxDQUFDO1lBRXhFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLFlBQVksQ0FBQztZQUNqQixHQUFHO2dCQUNDLFlBQVksR0FBRyxNQUFNLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUUzRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2hELE1BQU0sUUFBUSxHQUFvQixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUMvQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFOzRCQUNsQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO3lCQUN4Qzt3QkFDRCxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQzdGO29CQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUM5QjtnQkFDRCxJQUFJLEVBQUUsQ0FBQztnQkFDUCxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQzthQUNwQyxRQUFRLFlBQVksSUFBSSxZQUFZLENBQUMsR0FBRyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUUxRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsTUFBTSxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkQ7WUFFRCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRSxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFdBQVc7O1lBQ3BCLE1BQU0sb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQzNDLDRCQUE0QixDQUFDLENBQUM7WUFFbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDbkQsTUFBTSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUNoRSxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNXLFNBQVM7O1lBQ25CLE1BQU0sb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQzNDLDRCQUE0QixDQUFDLENBQUM7WUFFbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJO2dCQUN6QixXQUFXLEVBQUUsMkJBQVksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3hDLGFBQWEsRUFBRSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO2FBQzdDLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNXLFNBQVM7O1lBQ25CLE1BQU0sb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQzNDLDRCQUE0QixDQUFDLENBQUM7WUFFbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sb0JBQW9CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUMvRCxDQUFDO0tBQUE7Q0FDSjtBQW5SRCxrQ0FtUkMifQ==