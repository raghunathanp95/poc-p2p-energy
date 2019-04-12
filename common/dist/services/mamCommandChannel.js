"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mam_1 = __importDefault(require("@iota/mam"));
const serviceFactory_1 = require("../factories/serviceFactory");
const trytesHelper_1 = require("../utils/trytesHelper");
/**
 * Class for encapsulating mam methods.
 */
class MamCommandChannel {
    /**
     * Create a new instance of MamChannel.
     * @param config The configuration to use.
     */
    constructor(config) {
        this._config = config;
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
            let mamState = mam_1.default.init(this._config.provider, channelConfiguration.seed);
            mamState = mam_1.default.changeMode(mamState, "restricted", channelConfiguration.sideKey);
            if (!channelConfiguration.initialRoot) {
                channelConfiguration.initialRoot = mam_1.default.getRoot(mamState);
            }
            channelConfiguration.mostRecentRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
            mamState.channel.next_root = channelConfiguration.nextRoot;
            mamState.channel.start = channelConfiguration.start;
            const message = mam_1.default.create(mamState, trytesHelper_1.TrytesHelper.toTrytes(command));
            yield mam_1.default.attach(message.payload, message.address, this._config.depth, this._config.mwm);
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
                    mam_1.default.init(this._config.provider);
                    let fetchResponse;
                    do {
                        channelConfiguration.mostRecentRoot = nextRoot;
                        fetchResponse = yield mam_1.default.fetchSingle(nextRoot, "restricted", channelConfiguration.sideKey);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFtQ29tbWFuZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvbWFtQ29tbWFuZENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QixnRUFBNkQ7QUFLN0Qsd0RBQXFEO0FBRXJEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFXMUI7OztPQUdHO0lBQ0gsWUFBWSxNQUEwQjtRQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVSxZQUFZLENBQUMsb0JBQThDOztZQUNwRSxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsMkJBQVksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUQsb0JBQW9CLENBQUMsT0FBTyxHQUFHLDJCQUFZLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdELG9CQUFvQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDL0Isb0JBQW9CLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUM3QyxvQkFBb0IsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQzFDLG9CQUFvQixDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7WUFFaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQ3BCLEtBQUssRUFDTCwwQkFBMEIsRUFDMUI7Z0JBQ0ksSUFBSSxFQUFFLG9CQUFvQixDQUFDLElBQUk7Z0JBQy9CLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxPQUFPO2FBQ3hDLENBQUMsQ0FBQztZQUVQLE1BQU0sWUFBWSxHQUFnQjtnQkFDOUIsT0FBTyxFQUFFLE9BQU87YUFDbkIsQ0FBQztZQUVGLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxv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