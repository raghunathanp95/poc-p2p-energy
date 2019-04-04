"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mam_1 = __importDefault(require("@iota/mam"));
var serviceFactory_1 = require("../factories/serviceFactory");
var trytesHelper_1 = require("../utils/trytesHelper");
/**
 * Class for encapsulating mam methods.
 */
var MamCommandChannel = /** @class */ (function () {
    /**
     * Create a new instance of MamChannel.
     * @param config The configuration to use.
     */
    function MamCommandChannel(config) {
        this._config = config;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
    }
    /**
     * Create a new writable mam channel.
     * @param channelConfiguration The configuration to be populated for the channel.
     * @param config The configuration for node connectivity.
     * @returns The seed, key, initial root and next root if a payload was provided.
     */
    MamCommandChannel.prototype.openWritable = function (channelConfiguration) {
        return __awaiter(this, void 0, void 0, function () {
            var helloCommand;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        helloCommand = {
                            command: "hello"
                        };
                        return [4 /*yield*/, this.sendCommand(channelConfiguration, helloCommand)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("mam", "Opening Writable Channel", {
                            initialRoot: channelConfiguration.initialRoot
                        });
                        return [2 /*return*/, channelConfiguration];
                }
            });
        });
    };
    /**
     * Initialise a readable mam channel by reading it to most recent payload.
     * @param channelConfiguration The current configuration for the channel.
     * @returns True if we could read the hello command from the channel.
     */
    MamCommandChannel.prototype.openReadable = function (channelConfiguration) {
        return __awaiter(this, void 0, void 0, function () {
            var commands;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._loggingService.log("mam", "Opening Readable Channel", channelConfiguration.initialRoot);
                        return [4 /*yield*/, this.receiveCommands(channelConfiguration, "hello")];
                    case 1:
                        commands = _a.sent();
                        return [2 /*return*/, commands && commands.length > 0 && commands[0].command === "hello"];
                }
            });
        });
    };
    /**
     * Close a writable a mam channel.
     * @param channelConfiguration The current configuration for the channel.
     */
    MamCommandChannel.prototype.closeWritable = function (channelConfiguration) {
        return __awaiter(this, void 0, void 0, function () {
            var goodbyeCommand;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._loggingService.log("mam", "Closing Writable Channel");
                        goodbyeCommand = {
                            command: "goodbye"
                        };
                        return [4 /*yield*/, this.sendCommand(channelConfiguration, goodbyeCommand)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send a command to the mam channel.
     * @param channelConfiguration The current configuration for the channel.
     * @param command The payload to send.
     */
    MamCommandChannel.prototype.sendCommand = function (channelConfiguration, command) {
        return __awaiter(this, void 0, void 0, function () {
            var mamState, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._loggingService.log("mam", "Send Command", command);
                        mamState = mam_1.default.init(this._config.provider, channelConfiguration.seed);
                        mamState = mam_1.default.changeMode(mamState, "restricted", channelConfiguration.sideKey);
                        if (!channelConfiguration.initialRoot) {
                            channelConfiguration.initialRoot = mam_1.default.getRoot(mamState);
                        }
                        channelConfiguration.mostRecentRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
                        mamState.channel.next_root = channelConfiguration.nextRoot;
                        mamState.channel.start = channelConfiguration.start;
                        message = mam_1.default.create(mamState, trytesHelper_1.TrytesHelper.toTrytes(command));
                        return [4 /*yield*/, mam_1.default.attach(message.payload, message.address, this._config.depth, this._config.mwm)];
                    case 1:
                        _a.sent();
                        channelConfiguration.nextRoot = mamState.channel.next_root;
                        channelConfiguration.start = mamState.channel.start;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Receive commands from the mam channel.
     * @param channelConfiguration The configuration for the channel.
     * @param terminateCommand Stop reading the command if you see the specific command.
     * @returns A list of the new commands.
     */
    MamCommandChannel.prototype.receiveCommands = function (channelConfiguration, terminateCommand) {
        return __awaiter(this, void 0, void 0, function () {
            var commands, nextRoot, fetchResponse, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commands = [];
                        if (!channelConfiguration) return [3 /*break*/, 5];
                        nextRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
                        if (!nextRoot) return [3 /*break*/, 5];
                        mam_1.default.init(this._config.provider);
                        fetchResponse = void 0;
                        _a.label = 1;
                    case 1:
                        channelConfiguration.mostRecentRoot = nextRoot;
                        return [4 /*yield*/, mam_1.default.fetchSingle(nextRoot, "restricted", channelConfiguration.sideKey)];
                    case 2:
                        fetchResponse = _a.sent();
                        if (fetchResponse) {
                            nextRoot = fetchResponse.nextRoot;
                            if (fetchResponse.payload) {
                                command = trytesHelper_1.TrytesHelper.fromTrytes(fetchResponse.payload);
                                this._loggingService.log("mam", "Received Command", command);
                                this.defaultHandleCommand(channelConfiguration, command);
                                commands.push(command);
                                if (terminateCommand && command.command === terminateCommand) {
                                    fetchResponse = undefined;
                                }
                            }
                        }
                        _a.label = 3;
                    case 3:
                        if (fetchResponse && fetchResponse.payload && channelConfiguration.sideKey) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4:
                        if (channelConfiguration.sideKey) {
                            channelConfiguration.nextRoot = nextRoot;
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/, commands];
                }
            });
        });
    };
    /**
     * Perform a reset on the channel.
     * @param channelConfiguration The configuration for the channel.
     */
    MamCommandChannel.prototype.reset = function (channelConfiguration) {
        return __awaiter(this, void 0, void 0, function () {
            var resetCommand;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resetCommand = {
                            command: "goodbye"
                        };
                        return [4 /*yield*/, this.sendCommand(channelConfiguration, resetCommand)];
                    case 1:
                        _a.sent();
                        // Open a new channel and send the hello message
                        return [4 /*yield*/, this.openWritable(channelConfiguration)];
                    case 2:
                        // Open a new channel and send the hello message
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle and commands we can process internally.
     * @param channelConfiguration The channel configuration.
     * @param command The command.
     */
    MamCommandChannel.prototype.defaultHandleCommand = function (channelConfiguration, command) {
        if (command.command === "hello") {
            // nothing else in this payload
            // we would normally see this during the open of the channel
            this._loggingService.log("registration", "handling '" + command.command + "'");
        }
        else if (command.command === "goodbye") {
            // nothing else in this payload, although we should stop reading when we see this
            // so reset all the channel details, so an external user will know to reset the channel as well
            this._loggingService.log("registration", "handling '" + command.command + "'");
            channelConfiguration.initialRoot = undefined;
            channelConfiguration.mostRecentRoot = undefined;
            channelConfiguration.nextRoot = undefined;
            channelConfiguration.sideKey = undefined;
            channelConfiguration.start = undefined;
        }
    };
    return MamCommandChannel;
}());
exports.MamCommandChannel = MamCommandChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFtQ29tbWFuZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvbWFtQ29tbWFuZENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUE0QjtBQUM1Qiw4REFBNkQ7QUFLN0Qsc0RBQXFEO0FBRXJEOztHQUVHO0FBQ0g7SUFXSTs7O09BR0c7SUFDSCwyQkFBWSxNQUEwQjtRQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVSx3Q0FBWSxHQUF6QixVQUEwQixvQkFBOEM7Ozs7Ozt3QkFDcEUsb0JBQW9CLENBQUMsSUFBSSxHQUFHLDJCQUFZLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMxRCxvQkFBb0IsQ0FBQyxPQUFPLEdBQUcsMkJBQVksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzdELG9CQUFvQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQy9CLG9CQUFvQixDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7d0JBQzdDLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7d0JBQzFDLG9CQUFvQixDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7d0JBRWhELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUNwQixLQUFLLEVBQ0wsMEJBQTBCLEVBQzFCOzRCQUNJLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxJQUFJOzRCQUMvQixPQUFPLEVBQUUsb0JBQW9CLENBQUMsT0FBTzt5QkFDeEMsQ0FBQyxDQUFDO3dCQUVELFlBQVksR0FBZ0I7NEJBQzlCLE9BQU8sRUFBRSxPQUFPO3lCQUNuQixDQUFD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