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
Object.defineProperty(exports, "__esModule", { value: true });
var serviceFactory_1 = require("../factories/serviceFactory");
var mamCommandChannel_1 = require("./mamCommandChannel");
/**
 * Class to handle a source.
 */
var SourceManager = /** @class */ (function () {
    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the source.
     * @param nodeConfig The configuration for a tangle node.
     */
    function SourceManager(sourceConfig, nodeConfig) {
        this._config = sourceConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("source-registration");
    }
    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    SourceManager.prototype.intialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadState()];
                    case 1:
                        _a.sent();
                        this._loggingService.log("source-init", "Registering with Producer");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, this._config.type, this._state && this._state.channel && this._state.channel.sideKey, this._state && this._state.channel && this._state.channel.initialRoot)];
                    case 2:
                        _a.sent();
                        this._loggingService.log("source-init", "Registered with Producer");
                        if (!this._state.channel) return [3 /*break*/, 3];
                        this._loggingService.log("source-init", "Channel Config already exists");
                        return [3 /*break*/, 6];
                    case 3:
                        this._loggingService.log("source-init", "Channel Config not found");
                        this._loggingService.log("source-init", "Creating Channel");
                        itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        this._state.channel = {};
                        return [4 /*yield*/, itemMamChannel.openWritable(this._state.channel)];
                    case 4:
                        _a.sent();
                        this._loggingService.log("source-init", "Creating Channel Success");
                        this._loggingService.log("source-init", "Updating Registration");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, this._config.type, this._state.channel.sideKey, this._state.channel.initialRoot)];
                    case 5:
                        _a.sent();
                        this._loggingService.log("source-init", "Updated Registration");
                        _a.label = 6;
                    case 6:
                        this._loggingService.log("source-init", "Registration Complete");
                        return [4 /*yield*/, this.saveState()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Unregister the source from the Producer.
     */
    SourceManager.prototype.closedown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._state && this._state.channel)) return [3 /*break*/, 2];
                        this._loggingService.log("source", "Sending Goodbye");
                        itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, itemMamChannel.closeWritable(this._state.channel)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("source", "Sending Goodbye Complete");
                        this._state.channel = undefined;
                        _a.label = 2;
                    case 2:
                        this._loggingService.log("source", "Unregistering from the Producer");
                        return [4 /*yield*/, this._registrationService.unregister(this._config.id)];
                    case 3:
                        _a.sent();
                        this._loggingService.log("source", "Unregistered from the Producer");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send an output command to the mam channel.
     * @param value The output to send.
     */
    SourceManager.prototype.sendOutputCommand = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                command = {
                    command: "output",
                    startTime: this._state.lastOutputTime + 1,
                    endTime: Date.now(),
                    output: value
                };
                this._state.lastOutputTime = command.endTime;
                return [2 /*return*/, this.sendCommand(command)];
            });
        });
    };
    /**
     * Send a command to the channel.
     */
    SourceManager.prototype.sendCommand = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var mamCommandChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, mamCommandChannel.sendCommand(this._state.channel, command)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.saveState()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load the state for the producer.
     */
    SourceManager.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("source-storage-manager-state");
                        this._loggingService.log("source", "Loading State");
                        _a = this;
                        return [4 /*yield*/, storageConfigService.get("state")];
                    case 1:
                        _a._state = _b.sent();
                        this._loggingService.log("source", "Loaded State");
                        this._state = this._state || {
                            lastOutputTime: Date.now()
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store the state for the source.
     */
    SourceManager.prototype.saveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("source-storage-manager-state");
                        this._loggingService.log("source", "Storing State");
                        return [4 /*yield*/, storageConfigService.set("state", this._state)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("source", "Storing State Complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    return SourceManager;
}());
exports.SourceManager = SourceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zb3VyY2VNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBNkQ7QUFTN0QseURBQXdEO0FBQ3hEOztHQUVHO0FBQ0g7SUEwQkk7Ozs7T0FJRztJQUNILHVCQUNJLFlBQWtDLEVBQ2xDLFVBQThCO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIscUJBQXFCLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsaUNBQVMsR0FBdEI7Ozs7OzRCQUNJLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7d0JBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO3dCQUVyRSxxQkFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUNqRSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUks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