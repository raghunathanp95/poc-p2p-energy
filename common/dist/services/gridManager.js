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
                            usage: []
                        };
                    }
                    // Only store usage commands that we havent already seen
                    if (!consumerStore.usage.find(o => o.startTime === outputCommand.startTime)) {
                        consumerStore.usage.push({
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
            const updatedState1 = yield this.updateConsumers();
            const updatedState2 = yield this.updateProducers();
            if (updatedState1 || updatedState2) {
                yield this.saveState();
            }
        });
    }
    /**
     * Update the consumers using the strategy.
     * @private
     */
    updateConsumers() {
        return __awaiter(this, void 0, void 0, function* () {
            const consumerUsageStoreService = serviceFactory_1.ServiceFactory.get("grid-consumer-usage-store");
            const consumerUsageById = {};
            let pageSize = 10;
            let page = 0;
            let pageResponse;
            do {
                pageResponse = yield consumerUsageStoreService.page(undefined, page, pageSize);
                for (let i = 0; i < pageResponse.items.length; i++) {
                    const consumerUsage = pageResponse.items[i];
                    consumerUsageById[consumerUsage.id] = consumerUsage.usage;
                }
                page++;
                pageSize = pageResponse.pageSize;
            } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);
            const result = yield this._strategy.consumers(consumerUsageById, this._state);
            for (const consumerId in consumerUsageById) {
                if (consumerUsageById[consumerId].length === 0) {
                    yield consumerUsageStoreService.remove(`${this._config.id}/${consumerId}`);
                }
            }
            return result.updatedState;
        });
    }
    /**
     * Update the producers using the strategy.
     * @private
     */
    updateProducers() {
        return __awaiter(this, void 0, void 0, function* () {
            const producerOutputService = serviceFactory_1.ServiceFactory.get("grid-producer-output-store");
            const producerOutputById = {};
            let pageSize = 10;
            let page = 0;
            let pageResponse;
            do {
                pageResponse = yield producerOutputService.page(undefined, page, pageSize);
                for (let i = 0; i < pageResponse.items.length; i++) {
                    const producer = pageResponse.items[i];
                    producerOutputById[producer.id] = producer.output;
                }
                page++;
                pageSize = pageResponse.pageSize;
            } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);
            const result = yield this._strategy.producers(producerOutputById, this._state);
            for (const producerId in producerOutputById) {
                if (producerOutputById[producerId].length === 0) {
                    yield producerOutputService.remove(`${this._config.id}/${producerId}`);
                }
            }
            return result.updatedState;
        });
    }
    /**
     * Load the state for the grid.
     * @private
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGdFQUE2RDtBQWM3RCx3REFBcUQ7QUFFckQ7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUEyQnBCOzs7OztPQUtHO0lBQ0gsWUFDSSxVQUE4QixFQUM5QixvQkFBMEMsRUFDMUMsUUFBMEI7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7UUFDMUIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ1UsVUFBVTs7WUFDbkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVSxTQUFTOztZQUNsQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsY0FBYyxDQUFDLFlBQTJCLEVBQUUsUUFBdUI7O1lBQzVFLE1BQU0sMEJBQTBCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQ2pELDRCQUE0QixDQUFDLENBQUM7WUFDbEMsTUFBTSx5QkFBeUIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDaEQsMkJBQTJCLENBQUMsQ0FBQztZQUVqQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDeEIsSUFBSSxhQUE4QixDQUFDO1lB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