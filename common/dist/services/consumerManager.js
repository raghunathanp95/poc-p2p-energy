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
 * Class to handle a consumer.
 */
var ConsumerManager = /** @class */ (function () {
    /**
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    function ConsumerManager(consumerConfig, nodeConfig) {
        this._config = consumerConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("consumer-registration");
    }
    /**
     * Get the state for the manager.
     */
    ConsumerManager.prototype.getState = function () {
        return this._state;
    };
    /**
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    ConsumerManager.prototype.initialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, returnMamChannel, itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadState()];
                    case 1:
                        _a.sent();
                        this._loggingService.log("consumer-init", "Registering with Grid");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "consumer", this._state && this._state.channel && this._state.channel.initialRoot, this._state && this._state.channel && this._state.channel.sideKey)];
                    case 2:
                        response = _a.sent();
                        this._loggingService.log("consumer-init", "Registered with Grid");
                        this._loggingService.log("consumer-init", "Grid returned mam channel: " + response.root + ", " + response.sideKey);
                        if (!(!this._state.returnChannel && response.root && response.sideKey)) return [3 /*break*/, 4];
                        this._loggingService.log("consumer-init", "Opening return channel");
                        this._state.returnChannel = {
                            initialRoot: response.root,
                            sideKey: response.sideKey
                        };
                        returnMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, returnMamChannel.openReadable(this._state.returnChannel)];
                    case 3:
                        if (_a.sent()) {
                            this._loggingService.log("consumer-init", "Opening return channel success");
                        }
                        else {
                            this._loggingService.log("consumer-init", "Opening return channel failed");
                        }
                        _a.label = 4;
                    case 4:
                        if (!this._state.channel) return [3 /*break*/, 5];
                        this._loggingService.log("consumer-init", "Channel Config already exists");
                        return [3 /*break*/, 8];
                    case 5:
                        this._loggingService.log("consumer-init", "Channel Config not found");
                        this._loggingService.log("consumer-init", "Creating Channel");
                        itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        this._state.channel = {};
                        return [4 /*yield*/, itemMamChannel.openWritable(this._state.channel)];
                    case 6:
                        _a.sent();
                        this._loggingService.log("consumer-init", "Creating Channel Success");
                        this._loggingService.log("consumer-init", "Updating Registration");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "consumer", this._state.channel.initialRoot, this._state.channel.sideKey)];
                    case 7:
                        _a.sent();
                        this._loggingService.log("consumer-init", "Updated Registration");
                        _a.label = 8;
                    case 8:
                        this._loggingService.log("consumer-init", "Registration Complete");
                        return [4 /*yield*/, this.saveState()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Unregister the source from the Grid.
     */
    ConsumerManager.prototype.closedown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._state && this._state.channel)) return [3 /*break*/, 2];
                        this._loggingService.log("consumer-closedown", "Sending Goodbye");
                        itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, itemMamChannel.closeWritable(this._state.channel)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("consumer-closedown", "Sending Goodbye Complete");
                        this._state.channel = undefined;
                        _a.label = 2;
                    case 2:
                        this._loggingService.log("consumer-closedown", "Unregistering from the Grid");
                        return [4 /*yield*/, this._registrationService.unregister(this._config.id)];
                    case 3:
                        _a.sent();
                        this._loggingService.log("consumer-closedown", "Unregistered from the Grid");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load the state for the consumer.
     */
    ConsumerManager.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("consumer-storage-manager-state");
                        this._loggingService.log("consumer", "Loading State");
                        _a = this;
                        return [4 /*yield*/, storageConfigService.get(this._config.id)];
                    case 1:
                        _a._state = _b.sent();
                        this._loggingService.log("consumer", "Loaded State");
                        this._state = this._state || {
                            paidBalance: 0,
                            owedBalance: 0
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store the state for the consumer.
     */
    ConsumerManager.prototype.saveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("consumer-storage-manager-state");
                        this._loggingService.log("consumer", "Storing State");
                        return [4 /*yield*/, storageConfigService.set(this._config.id, this._state)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("consumer", "Storing State Complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    return ConsumerManager;
}());
exports.ConsumerManager = ConsumerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnN1bWVyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQTZEO0FBTzdELHlEQUF3RDtBQUV4RDs7R0FFRztBQUNIO0lBMEJJOzs7Ozs7T0FNRztJQUNILHlCQUNJLGNBQXNDLEVBQ3RDLFVBQThCO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1FBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIsdUJBQXVCLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxrQ0FBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7O09BR0c7SUFDVSxvQ0FBVSxHQUF2Qjs7Ozs7NEJBQ0kscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBdEIsU0FBc0IsQ0FBQzt3QkFFdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLENBQUM7d0JBRWxELHFCQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNqQixVQUFVLEVBQ1YsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQ3JFLElB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