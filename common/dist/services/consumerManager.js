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
     * @returns The state of the manager.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnN1bWVyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsZ0VBQTZEO0FBUzdELDJEQUF3RDtBQUV4RDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQStCeEI7Ozs7O09BS0c7SUFDSCxZQUNJLGNBQXNDLEVBQ3RDLG9CQUEwQyxFQUMxQyxRQUE4QjtRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztRQUM5QixJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUF1Qix1QkFBdUIsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7O09BR0c7SUFDSSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7O09BR0c7SUFDVSxVQUFVOztZQUNuQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUV2QixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUVuRSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNqQixVQUFVLEVBQ1YsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQ3JFLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUNwRSxDQUFDO1lBRUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFFbEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLDhCQUE4QixRQUFRLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRTlHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsSUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO2dCQUNwRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRztvQkFDeEIsV0FBVyxFQUFFLFFBQVEsQ0FBQyxJQUFJO29CQUMxQixPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87aUJBQzVCLENBQUM7Z0JBRUYsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUMzRSxJQUFJLE1BQU0sZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQ2hFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO2lCQUMvRTtxQkFBTTtvQkFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsK0JBQStCLENBQUMsQ0FBQztpQkFDOUU7YUFDSjtZQUVELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO2FBQzlFO2lCQUFNO2dCQUNILElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFFOUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFFekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUN6QixNQUFNLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLDBCQUEwQixDQUFDLENBQUM7Z0JBRXRFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNuRSxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNqQixVQUFVLEVBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQzlCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUM7YUFDckU7WUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUVuRSxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFNBQVM7O1lBQ2xCLElBQUksT0FBTyxDQUFDO1lBRVosSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUNwQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUV0QyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUVsRSxNQUFNLGNBQWMsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUV6RSxNQUFNLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFeEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztnQkFFM0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO2FBQ25DO1lBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztZQUU5RSxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFckUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztRQUNqRixDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDVSxjQUFjOztZQUN2QixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4RSxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBRXZDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFaEYsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM5RCxNQUFNLGlCQUFpQixHQUFHLElBQUkscUNBQWlCLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBRTVFLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLE1BQU0saUJBQWlCLENBQUMsZ0JBQWdCLENBQ2pFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ25DO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtnQkFDM0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFFckUsTUFBTSxjQUFjLEdBQUcsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRW5GLElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUM3QyxNQUFNLGVBQWUsR0FBcUMsRUFBRSxDQUFDO29CQUM3RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDNUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLGlCQUFpQixFQUFFOzRCQUNqRCxlQUFlLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQW1DLENBQUMsQ0FBQzt5QkFDN0U7cUJBQ0o7b0JBQ0QsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDNUIsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUNwRixZQUFZLEdBQUcsSUFBSSxDQUFDO3FCQUN2QjtpQkFDSjthQUNKO1lBRUQsSUFBSSxZQUFZLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDMUI7WUFFRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ1csU0FBUzs7WUFDbkIsTUFBTSxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDM0MsZ0NBQWdDLENBQUMsQ0FBQztZQUV0QyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUk7Z0JBQ3pCLGFBQWEsRUFBRSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUN6RCxjQUFjLEVBQUUsRUFBRTthQUNyQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ1csU0FBUzs7WUFDbkIsTUFBTSxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDM0MsZ0NBQWdDLENBQUMsQ0FBQztZQUV0QyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdEQsTUFBTSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtDQUNKO0FBN05ELDBDQTZOQyJ9