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
var mam_client_js_1 = __importDefault(require("mam.client.js"));
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
                        mamState = mam_client_js_1.default.init(this._config.provider, channelConfiguration.seed);
                        mamState = mam_client_js_1.default.changeMode(mamState, "restricted", channelConfiguration.sideKey);
                        if (!channelConfiguration.initialRoot) {
                            channelConfiguration.initialRoot = mam_client_js_1.default.getRoot(mamState);
                        }
                        channelConfiguration.mostRecentRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
                        mamState.channel.next_root = channelConfiguration.nextRoot;
                        mamState.channel.start = channelConfiguration.start;
                        message = mam_client_js_1.default.create(mamState, trytesHelper_1.TrytesHelper.toTrytes(command));
                        return [4 /*yield*/, mam_client_js_1.default.attach(message.payload, message.address, this._config.depth, this._config.mwm)];
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
                        mam_client_js_1.default.init(this._config.provider);
                        fetchResponse = void 0;
                        _a.label = 1;
                    case 1:
                        channelConfiguration.mostRecentRoot = nextRoot;
                        return [4 /*yield*/, mam_client_js_1.default.fetchSingle(nextRoot, "restricted", channelConfiguration.sideKey)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFtQ29tbWFuZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvbWFtQ29tbWFuZENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdFQUFnQztBQUNoQyw4REFBNkQ7QUFLN0Qsc0RBQXFEO0FBRXJEOztHQUVHO0FBQ0g7SUFXSTs7O09BR0c7SUFDSCwyQkFBWSxNQUEwQjtRQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVSx3Q0FBWSxHQUF6QixVQUEwQixvQkFBOEM7Ozs7Ozt3QkFDcEUsb0JBQW9CLENBQUMsSUFBSSxHQUFHLDJCQUFZLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMxRCxvQkFBb0IsQ0FBQyxPQUFPLEdBQUcsMkJBQVksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzdELG9CQUFvQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQy9CLG9CQUFvQixDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7d0JBQzdDLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7d0JBQzFDLG9CQUFvQixDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7d0JBRWhELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUNwQixLQUFLLEVBQ0wsMEJBQTBCLEVBQzFCOzRCQUNJLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxJQUFJOzRCQUMvQixPQUFPLEVBQUUsb0JBQW9CLENBQUMsT0FBTzt5QkFDeEMsQ0FBQyxDQUFDO3dCQUVELFlBQVksR0FBZ0I7NEJBQzlCLE9BQU8sRUFBRSxPQUFPO3lCQUNuQixDQUFD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