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
const mamCommandChannel_1 = require("./mamCommandChannel");
/**
 * Class to maintain a Producer.
 */
class ProducerManager {
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor(producerConfig, loadBalancerSettings, strategy) {
        this._config = producerConfig;
        this._loadBalancerSettings = loadBalancerSettings;
        this._strategy = strategy;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("producer-registration");
    }
    /**
     * Get the state for the manager.
     * @returns The state of the producer manager.
     */
    getState() {
        return this._state;
    }
    /**
     * Initialise the producer by registering with the Grid.
     */
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            this._loggingService.log("producer-init", "Registering with Grid");
            yield this._registrationService.register(this._config.id, this._config.name, "producer", this._state && this._state.channel && this._state.channel.initialRoot, this._state && this._state.channel && this._state.channel.sideKey);
            this._loggingService.log("producer-init", `Registered with Grid`);
            if (this._state.channel) {
                this._loggingService.log("producer-init", `Channel Config already exists`);
            }
            else {
                this._loggingService.log("producer-init", `Channel Config not found`);
                this._loggingService.log("producer-init", `Creating Channel`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                this._state.channel = {};
                yield itemMamChannel.openWritable(this._state.channel);
                this._loggingService.log("producer-init", `Creating Channel Success`);
                this._loggingService.log("producer-init", `Updating Registration`);
                yield this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.initialRoot, this._state.channel.sideKey);
                this._loggingService.log("producer-init", `Updated Registration`);
            }
            this._loggingService.log("producer-init", `Registration Complete`);
            yield this.saveState();
        });
    }
    /**
     * Reset the producer channel.
     */
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state && this._state.channel) {
                this._loggingService.log("producer-reset", `Send Channel Reset`);
                const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                yield mamCommandChannel.reset(this._state.channel);
                yield this.saveState();
                this._loggingService.log("producer-reset", `Updating Registration with Grid`);
                yield this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.initialRoot, this._state.channel.sideKey);
                this._loggingService.log("producer-reset", `Updated Registration with Grid`);
            }
        });
    }
    /**
     * Closedown the producer by unregistering from the Grid.
     */
    closedown() {
        return __awaiter(this, void 0, void 0, function* () {
            let sideKey;
            if (this._state && this._state.channel) {
                sideKey = this._state.channel.sideKey;
                this._loggingService.log("producer-closedown", `Sending Goodbye`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                yield itemMamChannel.closeWritable(this._state.channel);
                this._loggingService.log("producer-closedown", `Sending Goodbye Complete`);
                this._state.channel = undefined;
            }
            this._loggingService.log("producer-closedown", `Unregistering from the Grid`);
            yield this._registrationService.unregister(this._config.id, sideKey);
            this._loggingService.log("producer-closedown", `Unregistered from the Grid`);
        });
    }
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    handleCommands(registration, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceStoreService = serviceFactory_1.ServiceFactory.get("producer-source-output-store");
            let store = yield sourceStoreService.get(`${this._config.id}/${registration.id}`);
            let updatedStore = false;
            for (let i = 0; i < commands.length; i++) {
                this._loggingService.log("grid", "Processing", commands[i]);
                if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                    // This mam channel will have handled any mam operation
                    // at the moment there is nothing else for use to do
                }
                else if (commands[i].command === "output") {
                    const outputCommand = commands[i];
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
                            output: outputCommand.output
                        });
                        updatedStore = true;
                    }
                }
            }
            if (updatedStore) {
                yield sourceStoreService.set(`${this._config.id}/${registration.id}`, store);
            }
            this._loggingService.log("producer", `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`);
        });
    }
    /**
     * Combine the information from the sources and generate an output command.
     * @returns Any new producer output commands.
     */
    updateStrategy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state && this._state.channel) {
                const sourceStoreService = serviceFactory_1.ServiceFactory.get("producer-source-output-store");
                const sourceOutputById = {};
                let pageSize = 10;
                let page = 0;
                let pageResponse;
                do {
                    // Get the sources page at a time
                    pageResponse = yield sourceStoreService.page(this._config.id, page, pageSize);
                    if (pageResponse && pageResponse.items) {
                        for (let i = 0; i < pageResponse.items.length; i++) {
                            const source = pageResponse.items[i];
                            sourceOutputById[source.id] = source.output;
                        }
                    }
                    page++;
                    pageSize = pageResponse.pageSize;
                } while (pageResponse && pageResponse.items && pageResponse.items.length > 0);
                const result1 = yield this._strategy.sources(this._config.id, sourceOutputById, this._state);
                this._state.unsentCommands = this._state.unsentCommands.concat(result1.commands);
                if (this._state.unsentCommands.length > 0) {
                    const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                    this._state.unsentCommands = yield mamCommandChannel.sendCommandQueue(this._state.channel, this._state.unsentCommands);
                }
                for (const sourceId in sourceOutputById) {
                    if (sourceOutputById[sourceId].length === 0) {
                        yield sourceStoreService.remove(`${this._config.id}/${sourceId}`);
                    }
                }
                const result2 = yield this._strategy.payments(this._config.id, this._state);
                if (result1.updatedState || result2.updatedState) {
                    yield this.saveState();
                }
                return result1.commands;
            }
            return [];
        });
    }
    /**
     * Load the state for the producer.
     */
    loadState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("producer-storage-manager-state");
            this._loggingService.log("producer", `Loading State`);
            this._state = yield storageConfigService.get(this._config.id);
            this._loggingService.log("producer", `Loaded State`);
            this._state = this._state || {
                strategyState: yield this._strategy.init(this._config.id),
                unsentCommands: []
            };
        });
    }
    /**
     * Store the state for the producer.
     */
    saveState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("producer-storage-manager-state");
            this._loggingService.log("producer", `Storing State`);
            yield storageConfigService.set(this._config.id, this._state);
            this._loggingService.log("producer", `Storing State Complete`);
        });
    }
}
exports.ProducerManager = ProducerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y2VyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsZ0VBQTZEO0FBYTdELDJEQUF3RDtBQUV4RDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQStCeEI7Ozs7O09BS0c7SUFDSCxZQUNJLGNBQXNDLEVBQ3RDLG9CQUEwQyxFQUMxQyxRQUE4QjtRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztRQUM5QixJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUF1Qix1QkFBdUIsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7O09BR0c7SUFDSSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNVLFVBQVU7O1lBQ25CLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBRW5FLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pCLFVBQVUsRUFDVixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFDckUsSUFBSSxD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