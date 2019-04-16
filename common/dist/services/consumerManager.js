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
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(consumerConfig, nodeConfig) {
        this._config = consumerConfig;
        this._nodeConfig = nodeConfig;
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
                const returnMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
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
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
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
            if (this._state && this._state.channel) {
                this._loggingService.log("consumer-closedown", `Sending Goodbye`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                yield itemMamChannel.closeWritable(this._state.channel);
                this._loggingService.log("consumer-closedown", `Sending Goodbye Complete`);
                this._state.channel = undefined;
            }
            this._loggingService.log("consumer-closedown", `Unregistering from the Grid`);
            yield this._registrationService.unregister(this._config.id);
            this._loggingService.log("consumer-closedown", `Unregistered from the Grid`);
        });
    }
    /**
     * Send a usage command to the mam channel.
     * @param endTime The end time for the current period.
     * @param value The usage to send.
     */
    sendUsageCommand(endTime, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = {
                command: "usage",
                startTime: this._state.lastUsageTime + 1,
                endTime,
                usage: value
            };
            this._state.lastUsageTime = command.endTime;
            return this.sendCommand(command);
        });
    }
    /**
     * Send a command to the channel.
     */
    sendCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
            yield mamCommandChannel.sendCommand(this._state.channel, command);
            yield this.saveState();
            return command;
        });
    }
    /**
     * Remove the state for the consumer.
     */
    removeState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("consumer-storage-manager-state");
            this._loggingService.log("consumer", `Removing State`);
            yield storageConfigService.remove(this._config.id);
            this._loggingService.log("consumer", `Removing State Complete`);
        });
    }
    /**
     * Load the state for the consumer.
     */
    loadState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("consumer-storage-manager-state");
            this._loggingService.log("consumer", `Loading State`);
            this._state = yield storageConfigService.get(this._config.id);
            this._loggingService.log("consumer", `Loaded State`);
            this._state = this._state || {
                paidBalance: 0,
                owedBalance: 0,
                lastUsageTime: 0
            };
        });
    }
    /**
     * Store the state for the consumer.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnN1bWVyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBUzdELDJEQUF3RDtBQUV4RDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQTBCeEI7Ozs7OztPQU1HO0lBQ0gsWUFDSSxjQUFzQyxFQUN0QyxVQUE4QjtRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztRQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQXVCLHVCQUF1QixDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsVUFBVTs7WUFDbkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFFbkUsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakIsVUFBVSxFQUNWLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUNyRSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FDcEUsQ0FBQztZQUVGLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBRWxFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSw4QkFBOEIsUUFBUSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUU5RyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUNqRSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUc7b0JBQ3hCLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFBSTtvQkFDMUIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO2lCQUM1QixDQUFDO2dCQUVGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ2pFLElBQUksTUFBTSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDaEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLGdDQUFnQyxDQUFDLENBQUM7aUJBQy9FO3FCQUFNO29CQUNILElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO2lCQUM5RTthQUNKO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLCtCQUErQixDQUFDLENBQUM7YUFDOUU7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLDBCQUEwQixDQUFDLENBQUM7Z0JBQ3RFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUU5RCxNQUFNLGNBQWMsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUN6QixNQUFNLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLDBCQUEwQixDQUFDLENBQUM7Z0JBRXRFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNuRSxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNqQixVQUFVLEVBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQzlCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUM7YUFDckU7WUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUVuRSxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFNBQVM7O1lBQ2xCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFFbEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRS9ELE1BQU0sY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV4RCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO2dCQUUzRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7YUFDbkM7WUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1lBRTlFLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTVELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLDRCQUE0QixDQUFDLENBQUM7UUFDakYsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLGdCQUFnQixDQUFDLE9BQWUsRUFBRSxLQUFhOztZQUN4RCxNQUFNLE9BQU8sR0FBMEI7Z0JBQ25DLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsQ0FBQztnQkFDeEMsT0FBTztnQkFDUCxLQUFLLEVBQUUsS0FBSzthQUNmLENBQUM7WUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBRTVDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFdBQVcsQ0FBd0IsT0FBVTs7WUFDdEQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRSxNQUFNLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsRSxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixPQUFPLE9BQU8sQ0FBQztRQUNuQixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNVLFdBQVc7O1lBQ3BCLE1BQU0sb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQzNDLGdDQUFnQyxDQUFDLENBQUM7WUFFdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDdkQsTUFBTSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUNwRSxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNXLFNBQVM7O1lBQ25CLE1BQU0sb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQzNDLGdDQUFnQyxDQUFDLENBQUM7WUFFdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFckQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJO2dCQUN6QixXQUFXLEVBQUUsQ0FBQztnQkFDZCxXQUFXLEVBQUUsQ0FBQztnQkFDZCxhQUFhLEVBQUUsQ0FBQzthQUNuQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVyxTQUFTOztZQUNuQixNQUFNLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUMzQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBRXRDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUN0RCxNQUFNLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDbkUsQ0FBQztLQUFBO0NBQ0o7QUE3TUQsMENBNk1DIn0=