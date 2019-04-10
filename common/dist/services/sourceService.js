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
var SourceService = /** @class */ (function () {
    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the source.
     * @param nodeConfig The configuration for a tangle node.
     */
    function SourceService(sourceConfig, nodeConfig) {
        this._config = sourceConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("registration");
    }
    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    SourceService.prototype.intialise = function () {
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
    SourceService.prototype.closedown = function () {
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
    SourceService.prototype.sendOutputCommand = function (value) {
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
    SourceService.prototype.sendCommand = function (command) {
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
    SourceService.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("storage-config");
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
    SourceService.prototype.saveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("storage-config");
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
    return SourceService;
}());
exports.SourceService = SourceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zb3VyY2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBNkQ7QUFTN0QseURBQXdEO0FBQ3hEOztHQUVHO0FBQ0g7SUEwQkk7Ozs7T0FJRztJQUNILHVCQUNJLFlBQWtDLEVBQ2xDLFVBQThCO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIsY0FBYyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVEOzs7T0FHRztJQUNVLGlDQUFTLEdBQXRCOzs7Ozs0QkFDSSxxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDO3dCQUV2QixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLENBQUMsQ0FBQzt3QkFFckUscUJBQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNqQixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFDakUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENB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