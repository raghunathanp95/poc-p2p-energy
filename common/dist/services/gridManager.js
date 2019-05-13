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
const mamCommandChannel_1 = require("./mamCommandChannel");
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
            // Remove all the consumed usage data from the storage
            for (const consumerId in consumerUsageById) {
                if (consumerUsageById[consumerId].length === 0) {
                    yield consumerUsageStoreService.remove(`${this._config.id}/${consumerId}`);
                }
            }
            // Now send any payment requests to the consumers
            const registrationStorageService = serviceFactory_1.ServiceFactory.get("registration-storage");
            for (const consumerId in result.paymentRequests) {
                const registration = yield registrationStorageService.get(consumerId);
                if (registration && registration.returnMamChannel) {
                    const mamReturnChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                    yield mamReturnChannel.sendCommand(registration.returnMamChannel, result.paymentRequests[consumerId]);
                    yield registrationStorageService.set(consumerId, registration);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGdFQUE2RDtBQWM3RCx3REFBcUQ7QUFDckQsMkRBQXdEO0FBRXhEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBMkJwQjs7Ozs7T0FLRztJQUNILFlBQ0ksVUFBOEIsRUFDOUIsb0JBQTBDLEVBQzFDLFFBQTBCO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO1FBQzFCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7O09BRUc7SUFDSSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNVLFVBQVU7O1lBQ25CLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsU0FBUzs7WUFDbEIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLGNBQWMsQ0FBQyxZQUEyQixFQUFFLFFBQXVCOztZQUM1RSxNQUFNLDBCQUEwQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUNqRCw0QkFBNEIsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0seUJBQXlCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQ2hELDJCQUEyQixDQUFDLENBQUM7WUFFakMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUks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