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
 * Class to handle a source.
 */
class SourceManager {
    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the source.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor(sourceConfig, loadBalancerSettings, strategy) {
        this._config = sourceConfig;
        this._loadBalancerSettings = loadBalancerSettings;
        this._strategy = strategy;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("source-registration");
    }
    /**
     * Get the state for the manager.
     */
    getState() {
        return this._state;
    }
    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            this._loggingService.log("source-init", "Registering with Producer");
            yield this._registrationService.register(this._config.id, this._config.name, this._config.type, this._state && this._state.channel && this._state.channel.initialRoot, this._state && this._state.channel && this._state.channel.sideKey);
            this._loggingService.log("source-init", `Registered with Producer`);
            if (this._state.channel) {
                this._loggingService.log("source-init", `Channel Config already exists`);
            }
            else {
                this._loggingService.log("source-init", `Channel Config not found`);
                this._loggingService.log("source-init", `Creating Channel`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                this._state.channel = {};
                yield itemMamChannel.openWritable(this._state.channel);
                this._loggingService.log("source-init", `Creating Channel Success`);
                this._loggingService.log("source-init", `Updating Registration`);
                yield this._registrationService.register(this._config.id, this._config.name, this._config.type, this._state.channel.initialRoot, this._state.channel.sideKey);
                this._loggingService.log("source-init", `Updated Registration`);
            }
            this._loggingService.log("source-init", `Registration Complete`);
            yield this.saveState();
        });
    }
    /**
     * Unregister the source from the Producer.
     */
    closedown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state && this._state.channel) {
                this._loggingService.log("source", `Sending Goodbye`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                yield itemMamChannel.closeWritable(this._state.channel);
                this._loggingService.log("source", `Sending Goodbye Complete`);
                this._state.channel = undefined;
            }
            this._loggingService.log("source", `Unregistering from the Producer`);
            yield this._registrationService.unregister(this._config.id);
            this._loggingService.log("source", `Unregistered from the Producer`);
        });
    }
    /**
     * Call the strategy to produce values for the source.
     * @returns Any new source output commands.
     */
    updateStrategy() {
        return __awaiter(this, void 0, void 0, function* () {
            const newCommands = yield this._strategy.value(this._state);
            for (let i = 0; i < newCommands.length; i++) {
                yield this.sendCommand(newCommands[i]);
            }
            yield this.saveState();
            return newCommands;
        });
    }
    /**
     * Send a command to the channel.
     */
    sendCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
            yield mamCommandChannel.sendCommand(this._state.channel, command);
            yield this.saveState();
            return command;
        });
    }
    /**
     * Load the state for the producer.
     */
    loadState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("source-storage-manager-state");
            this._loggingService.log("source", `Loading State`);
            this._state = yield storageConfigService.get(this._config.id);
            this._loggingService.log("source", `Loaded State`);
            this._state = this._state || {
                strategyState: yield this._strategy.init()
            };
        });
    }
    /**
     * Store the state for the source.
     */
    saveState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("source-storage-manager-state");
            this._loggingService.log("source", `Storing State`);
            yield storageConfigService.set(this._config.id, this._state);
            this._loggingService.log("source", `Storing State Complete`);
        });
    }
}
exports.SourceManager = SourceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zb3VyY2VNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSxnRUFBNkQ7QUFTN0QsMkRBQXdEO0FBQ3hEOztHQUVHO0FBQ0gsTUFBYSxhQUFhO0lBK0J0Qjs7Ozs7T0FLRztJQUNILFlBQ0ksWUFBa0MsRUFDbEMsb0JBQTBDLEVBQzFDLFFBQTRCO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO1FBQzVCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQXVCLHFCQUFxQixDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsVUFBVTs7WUFDbkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFFckUsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMs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