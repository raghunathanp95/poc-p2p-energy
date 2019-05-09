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
     * @param nodeWalkStrategy The load balancer settings for communications.
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