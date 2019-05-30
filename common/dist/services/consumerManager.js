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
 * Class to handle a consumer.
 */
class ConsumerManager {
    /**
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing usage commands.
     */
    constructor(consumerConfig, loadBalancerSettings, strategy) {
        this._config = consumerConfig;
        this._loadBalancerSettings = loadBalancerSettings;
        this._strategy = strategy;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("consumer-registration");
    }
    /**
     * Get the state for the manager.
     */
    getState() {
        return this._state;
    }
    /**
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            this._loggingService.log("consumer-init", "Registering with Grid");
            const response = yield this._registrationService.register(this._config.id, this._config.name, "consumer", this._state && this._state.channel && this._state.channel.initialRoot, this._state && this._state.channel && this._state.channel.sideKey);
            this._loggingService.log("consumer-init", `Registered with Grid`);
            this._loggingService.log("consumer-init", `Grid returned mam channel: ${response.root}, ${response.sideKey}`);
            if (!this._state.returnChannel && response.root && response.sideKey) {
                this._loggingService.log("consumer-init", `Opening return channel`);
                this._state.returnChannel = {
                    initialRoot: response.root,
                    sideKey: response.sideKey
                };
                const returnMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                if (yield returnMamChannel.openReadable(this._state.returnChannel)) {
                    this._loggingService.log("consumer-init", `Opening return channel success`);
                }
                else {
                    this._loggingService.log("consumer-init", `Opening return channel failed`);
                }
            }
            if (this._state.channel) {
                this._loggingService.log("consumer-init", `Channel Config already exists`);
            }
            else {
                this._loggingService.log("consumer-init", `Channel Config not found`);
                this._loggingService.log("consumer-init", `Creating Channel`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                this._state.channel = {};
                yield itemMamChannel.openWritable(this._state.channel);
                this._loggingService.log("consumer-init", `Creating Channel Success`);
                this._loggingService.log("consumer-init", `Updating Registration`);
                yield this._registrationService.register(this._config.id, this._config.name, "consumer", this._state.channel.initialRoot, this._state.channel.sideKey);
                this._loggingService.log("consumer-init", `Updated Registration`);
            }
            this._loggingService.log("consumer-init", `Registration Complete`);
            yield this.saveState();
        });
    }
    /**
     * Unregister the source from the Grid.
     */
    closedown() {
        return __awaiter(this, void 0, void 0, function* () {
            let sideKey;
            if (this._state && this._state.channel) {
                sideKey = this._state.channel.sideKey;
                this._loggingService.log("consumer-closedown", `Sending Goodbye`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                yield itemMamChannel.closeWritable(this._state.channel);
                this._loggingService.log("consumer-closedown", `Sending Goodbye Complete`);
                this._state.channel = undefined;
            }
            this._loggingService.log("consumer-closedown", `Unregistering from the Grid`);
            yield this._registrationService.unregister(this._config.id, sideKey);
            this._loggingService.log("consumer-closedown", `Unregistered from the Grid`);
        });
    }
    /**
     * Call the strategy to produce usage values for the consumer and check payment requests
     * @returns Any new consumer usage commands.
     */
    updateStrategy() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._strategy.usage(this._config.id, this._state);
            let updatedState = result.updatedState;
            this._state.unsentCommands = this._state.unsentCommands.concat(result.commands);
            if (this._state.channel && this._state.unsentCommands.length > 0) {
                const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                this._state.unsentCommands = yield mamCommandChannel.sendCommandQueue(this._state.channel, this._state.unsentCommands);
            }
            if (this._state.returnChannel) {
                const mamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                const returnCommands = yield mamChannel.receiveCommands(this._state.returnChannel);
                if (returnCommands && returnCommands.length > 0) {
                    const paymentRequests = [];
                    for (let i = 0; i < returnCommands.length; i++) {
                        if (returnCommands[i].command === "payment-request") {
                            paymentRequests.push(returnCommands[i]);
                        }
                    }
                    if (paymentRequests.length > 0) {
                        yield this._strategy.paymentRequests(this._config.id, this._state, paymentRequests);
                        updatedState = true;
                    }
                }
            }
            if (updatedState) {
                yield this.saveState();
            }
            return result.commands;
        });
    }
    /**
     * Load the state for the consumer.
     * @private
     */
    loadState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("consumer-storage-manager-state");
            this._loggingService.log("consumer", `Loading State`);
            this._state = yield storageConfigService.get(this._config.id);
            this._loggingService.log("consumer", `Loaded State`);
            this._state = this._state || {
                strategyState: yield this._strategy.init(this._config.id),
                unsentCommands: []
            };
        });
    }
    /**
     * Store the state for the consumer.
     * @private
     */
    saveState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("consumer-storage-manager-state");
            this._loggingService.log("consumer", `Storing State`);
            yield storageConfigService.set(this._config.id, this._state);
            this._loggingService.log("consumer", `Storing State Complete`);
        });
    }
}
exports.ConsumerManager = ConsumerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnN1bWVyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsZ0VBQTZEO0FBUzdELDJEQUF3RDtBQUV4RDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQStCeEI7Ozs7O09BS0c7SUFDSCxZQUNJLGNBQXNDLEVBQ3RDLG9CQUEwQyxFQUMxQyxRQUE4QjtRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztRQUM5QixJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUF1Qix1QkFBdUIsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNVLFVBQVU7O1lBQ25CLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBRW5FLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pCLFVBQVUsRUFDVixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdB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