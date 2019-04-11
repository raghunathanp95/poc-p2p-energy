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
     * Get the state for the manager.
     */
    SourceManager.prototype.getState = function () {
        return this._state;
    };
    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    SourceManager.prototype.initialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadState()];
                    case 1:
                        _a.sent();
                        this._loggingService.log("source-init", "Registering with Producer");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, this._config.type, this._state && this._state.channel && this._state.channel.initialRoot, this._state && this._state.channel && this._state.channel.sideKey)];
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
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, this._config.type, this._state.channel.initialRoot, this._state.channel.sideKey)];
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
                        return [4 /*yield*/, storageConfigService.get(this._config.id)];
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
                        return [4 /*yield*/, storageConfigService.set(this._config.id, this._state)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zb3VyY2VNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBNkQ7QUFTN0QseURBQXdEO0FBQ3hEOztHQUVHO0FBQ0g7SUEwQkk7Ozs7T0FJRztJQUNILHVCQUNJLFlBQWtDLEVBQ2xDLFVBQThCO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIscUJBQXFCLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxnQ0FBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7O09BR0c7SUFDVSxrQ0FBVSxHQUF2Qjs7Ozs7NEJBQ0kscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBdEIsU0FBc0IsQ0FBQzt3QkFFdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLDJCQUEyQixDQUFDLENBQUM7d0JBRXJFLHFCQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakIsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FB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