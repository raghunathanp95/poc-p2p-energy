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
                            paymentRegistrationId: registration.id
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
            if (updatedState1.updatedState || updatedState2) {
                yield this.saveState();
            }
            return updatedState1.returnCommands;
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
            const result = yield this._strategy.consumers(this._config.id, consumerUsageById, this._state);
            // Remove all the consumed usage data from the storage
            for (const consumerId in consumerUsageById) {
                if (consumerUsageById[consumerId].length === 0) {
                    yield consumerUsageStoreService.remove(`${this._config.id}/${consumerId}`);
                }
            }
            const returnCommands = {};
            // Now send any payment requests to the consumers
            for (const consumerId in result.paymentRequests) {
                returnCommands[consumerId] = [result.paymentRequests[consumerId]];
            }
            return {
                updatedState: result.updatedState,
                returnCommands
            };
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
            const result = yield this._strategy.producers(this._config.id, producerOutputById, this._state);
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
                strategyState: yield this._strategy.init(this._config.id)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGdFQUE2RDtBQWU3RDs7R0FFRztBQUNILE1BQWEsV0FBVztJQTJCcEI7Ozs7O09BS0c7SUFDSCxZQUNJLFVBQThCLEVBQzlCLG9CQUEwQyxFQUMxQyxRQUEwQjtRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztRQUMxQixJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7O09BRUc7SUFDVSxVQUFVOztZQUNuQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFNBQVM7O1lBQ2xCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxjQUFjLENBQUMsWUFBMkIsRUFBRSxRQUF1Qjs7WUFDNUUsTUFBTSwwQkFBMEIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDakQsNEJBQTRCLENBQUMsQ0FBQztZQUNsQyxNQUFNLHlCQUF5QixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUNoRCwyQkFBMkIsQ0FBQyxDQUFDO1lBRWpDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLGFBQThCLENBQUM7WUFDbkMsSUFBSSxhQUE2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