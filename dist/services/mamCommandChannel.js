"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_load_balancer_1 = require("@iota/client-load-balancer");
const mam_js_1 = require("@iota/mam.js");
const serviceFactory_1 = require("../factories/serviceFactory");
const trytesHelper_1 = require("../utils/trytesHelper");
/**
 * Class for encapsulating mam methods.
 */
class MamCommandChannel {
    /**
     * Create a new instance of MamChannel.
     * @param loadBalancerSettings The load balancer settings for communications.
     */
    constructor(loadBalancerSettings) {
        this._loadBalancerSettings = loadBalancerSettings;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
    }
    /**
     * Create a new writable mam channel.
     * @param channelConfiguration The configuration to be populated for the channel.
     * @param config The configuration for node connectivity.
     * @returns The seed, key, initial root and next root if a payload was provided.
     */
    openWritable(channelConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            channelConfiguration.seed = trytesHelper_1.TrytesHelper.generateHash(81);
            channelConfiguration.sideKey = trytesHelper_1.TrytesHelper.generateHash(81);
            channelConfiguration.start = 0;
            channelConfiguration.initialRoot = undefined;
            channelConfiguration.nextRoot = undefined;
            channelConfiguration.mostRecentRoot = undefined;
            this._loggingService.log("mam", "Opening Writable Channel", {
                seed: channelConfiguration.seed,
                sideKey: channelConfiguration.sideKey
            });
            const helloCommand = {
                command: "hello"
            };
            yield this.sendCommand(channelConfiguration, helloCommand);
            this._loggingService.log("mam", "Opening Writable Channel", {
                initialRoot: channelConfiguration.initialRoot
            });
            // Now read back from the channel until the hello is available to make sure
            // when we communicate the details to other entities it is ready
            let foundHello = false;
            const testChannelConfiguration = {
                sideKey: channelConfiguration.sideKey,
                seed: channelConfiguration.seed,
                initialRoot: channelConfiguration.initialRoot
            };
            do {
                const commands = yield this.receiveCommands(testChannelConfiguration, "hello");
                foundHello = commands && commands.length > 0 && commands[0].command === "hello";
            } while (!foundHello);
            return channelConfiguration;
        });
    }
    /**
     * Initialise a readable mam channel by reading it to most recent payload.
     * @param channelConfiguration The current configuration for the channel.
     * @returns True if we could read the hello command from the channel.
     */
    openReadable(channelConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            this._loggingService.log("mam", "Opening Readable Channel", channelConfiguration.initialRoot);
            const commands = yield this.receiveCommands(channelConfiguration, "hello");
            return commands && commands.length > 0 && commands[0].command === "hello";
        });
    }
    /**
     * Close a writable a mam channel.
     * @param channelConfiguration The current configuration for the channel.
     */
    closeWritable(channelConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            this._loggingService.log("mam", "Closing Writable Channel");
            const goodbyeCommand = {
                command: "goodbye"
            };
            yield this.sendCommand(channelConfiguration, goodbyeCommand);
        });
    }
    /**
     * Send a queue of commands to the mam channel.
     * @param channelConfiguration The current configuration for the channel.
     * @param commands The commands to send.
     * @returns Unsent commands.
     */
    sendCommandQueue(channelConfiguration, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            const unsent = commands.slice(0);
            for (let i = 0; i < commands.length; i++) {
                try {
                    yield this.sendCommand(channelConfiguration, unsent[0]);
                    unsent.shift();
                }
                catch (err) {
                    this._loggingService.error("consumer", "Sending command failed, aborting queue", err);
                }
            }
            return unsent;
        });
    }
    /**
     * Send a command to the mam channel.
     * @param channelConfiguration The current configuration for the channel.
     * @param command The payload to send.
     */
    sendCommand(channelConfiguration, command) {
        return __awaiter(this, void 0, void 0, function* () {
            this._loggingService.log("mam", "Send Command", command);
            const channelState = mam_js_1.createChannel(channelConfiguration.seed, 2, "restricted", channelConfiguration.sideKey);
            if (!channelConfiguration.initialRoot) {
                channelConfiguration.initialRoot = mam_js_1.channelRoot(channelState);
            }
            channelConfiguration.mostRecentRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
            channelState.nextRoot = channelConfiguration.nextRoot;
            channelState.start = channelConfiguration.start;
            const message = mam_js_1.createMessage(channelState, trytesHelper_1.TrytesHelper.toTrytes(command));
            const iota = client_load_balancer_1.composeAPI(this._loadBalancerSettings);
            yield mam_js_1.mamAttach(iota, message, 0, 0);
            channelConfiguration.nextRoot = channelState.nextRoot;
            channelConfiguration.start = channelState.start;
        });
    }
    /**
     * Receive commands from the mam channel.
     * @param channelConfiguration The configuration for the channel.
     * @param terminateCommand Stop reading the command if you see the specific command.
     * @returns A list of the new commands.
     */
    receiveCommands(channelConfiguration, terminateCommand) {
        return __awaiter(this, void 0, void 0, function* () {
            const commands = [];
            if (channelConfiguration) {
                let nextRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
                if (nextRoot) {
                    const iota = client_load_balancer_1.composeAPI(this._loadBalancerSettings);
                    let fetchResponse;
                    do {
                        channelConfiguration.mostRecentRoot = nextRoot;
                        try {
                            fetchResponse = yield mam_js_1.mamFetch(iota, nextRoot, "restricted", channelConfiguration.sideKey);
                            if (fetchResponse) {
                                nextRoot = fetchResponse.nextRoot;
                                if (fetchResponse.message) {
                                    const command = trytesHelper_1.TrytesHelper.fromTrytes(fetchResponse.message);
                                    this._loggingService.log("mam", "Received Command", command);
                                    this.defaultHandleCommand(channelConfiguration, command);
                                    commands.push(command);
                                    if (terminateCommand && command.command === terminateCommand) {
                                        fetchResponse = undefined;
                                    }
                                }
                            }
                        }
                        catch (err) {
                            this._loggingService.error("mam", "Failed to fetch", err);
                            fetchResponse = undefined;
                        }
                    } while (fetchResponse && fetchResponse.message && channelConfiguration.sideKey);
                    if (channelConfiguration.sideKey) {
                        channelConfiguration.nextRoot = nextRoot;
                    }
                }
            }
            return commands;
        });
    }
    /**
     * Perform a reset on the channel.
     * @param channelConfiguration The configuration for the channel.
     */
    reset(channelConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            // Send a goodbye to the channel
            // which will make the recipient wait for new details
            // before continuing communications
            const resetCommand = {
                command: "goodbye"
            };
            yield this.sendCommand(channelConfiguration, resetCommand);
            // Open a new channel and send the hello message
            yield this.openWritable(channelConfiguration);
        });
    }
    /**
     * Handle and commands we can process internally.
     * @param channelConfiguration The channel configuration.
     * @param command The command.
     */
    defaultHandleCommand(channelConfiguration, command) {
        if (command.command === "hello") {
            // nothing else in this payload
            // we would normally see this during the open of the channel
            this._loggingService.log("registration", `handling '${command.command}'`);
        }
        else if (command.command === "goodbye") {
            // nothing else in this payload, although we should stop reading when we see this
            // so reset all the channel details, so an external user will know to reset the channel as well
            this._loggingService.log("registration", `handling '${command.command}'`);
            channelConfiguration.initialRoot = undefined;
            channelConfiguration.mostRecentRoot = undefined;
            channelConfiguration.nextRoot = undefined;
            channelConfiguration.sideKey = undefined;
            channelConfiguration.start = undefined;
        }
    }
}
exports.MamCommandChannel = MamCommandChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFtQ29tbWFuZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvbWFtQ29tbWFuZENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxRUFBOEU7QUFDOUUseUNBQWtIO0FBQ2xILGdFQUE2RDtBQUk3RCx3REFBcUQ7QUFFckQ7O0dBRUc7QUFDSCxNQUFhLGlCQUFpQjtJQVcxQjs7O09BR0c7SUFDSCxZQUFZLG9CQUEwQztRQUNsRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1UsWUFBWSxDQUFDLG9CQUE4Qzs7WUFDcEUsb0JBQW9CLENBQUMsSUFBSSxHQUFHLDJCQUFZLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFELG9CQUFvQixDQUFDLE9BQU8sR0FBRywyQkFBWSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3RCxvQkFBb0IsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLG9CQUFvQixDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7WUFDN0Msb0JBQW9CLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUMxQyxvQkFBb0IsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1lBRWhELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUNwQixLQUFLLEVBQ0wsMEJBQTBCLEVBQzFCO2dCQUNJLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxJQUFJO2dCQUMvQixPQUFPLEVBQUUsb0JBQW9CLENBQUMsT0FBTzthQUN4QyxDQUFDLENBQUM7WUFFUCxNQUFNLFlBQVksR0FBZ0I7Z0JBQzlCLE9BQU8sRUFBRSxPQUFPO2FBQ25CLENBQUM7WUFFRixNQUFNLElBQUks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