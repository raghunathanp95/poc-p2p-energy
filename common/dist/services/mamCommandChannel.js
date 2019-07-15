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
const client_load_balancer_1 = require("@iota/client-load-balancer");
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
            let mamState = client_load_balancer_1.Mam.init(this._loadBalancerSettings, channelConfiguration.seed);
            mamState = client_load_balancer_1.Mam.changeMode(mamState, "restricted", channelConfiguration.sideKey);
            if (!channelConfiguration.initialRoot) {
                channelConfiguration.initialRoot = client_load_balancer_1.Mam.getRoot(mamState);
            }
            channelConfiguration.mostRecentRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
            mamState.channel.next_root = channelConfiguration.nextRoot;
            mamState.channel.start = channelConfiguration.start;
            const message = client_load_balancer_1.Mam.create(mamState, trytesHelper_1.TrytesHelper.toTrytes(command));
            yield client_load_balancer_1.Mam.attach(message.payload, message.address);
            channelConfiguration.nextRoot = mamState.channel.next_root;
            channelConfiguration.start = mamState.channel.start;
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
                    client_load_balancer_1.Mam.init(this._loadBalancerSettings);
                    let fetchResponse;
                    do {
                        channelConfiguration.mostRecentRoot = nextRoot;
                        try {
                            fetchResponse = yield client_load_balancer_1.Mam.fetchSingle(nextRoot, "restricted", channelConfiguration.sideKey);
                            if (fetchResponse) {
                                nextRoot = fetchResponse.nextRoot;
                                if (fetchResponse.payload) {
                                    const command = trytesHelper_1.TrytesHelper.fromTrytes(fetchResponse.payload);
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
                    } while (fetchResponse && fetchResponse.payload && channelConfiguration.sideKey);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFtQ29tbWFuZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvbWFtQ29tbWFuZENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUF1RTtBQUN2RSxnRUFBNkQ7QUFJN0Qsd0RBQXFEO0FBRXJEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFXMUI7OztPQUdHO0lBQ0gsWUFBWSxvQkFBMEM7UUFDbEQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO1FBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNVLFlBQVksQ0FBQyxvQkFBOEM7O1lBQ3BFLG9CQUFvQixDQUFDLElBQUksR0FBRywyQkFBWSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRCxvQkFBb0IsQ0FBQyxPQUFPLEdBQUcsMkJBQVksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0Qsb0JBQW9CLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUMvQixvQkFBb0IsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1lBQzdDLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDMUMsb0JBQW9CLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztZQUVoRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FDcEIsS0FBSyxFQUNMLDBCQUEwQixFQUMxQjtnQkFDSSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsSUFBSTtnQkFDL0IsT0FBTyxFQUFFLG9CQUFvQixDQUFDLE9BQU87YUFDeEMsQ0FBQyxDQUFDO1lBRVAsTUFBTSxZQUFZLEdBQWdCO2dCQUM5QixPQUFPLEVBQUUsT0FBTzthQUNuQixDQUFDO1lBRUYsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFD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