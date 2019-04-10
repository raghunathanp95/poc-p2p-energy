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
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    ConsumerManager.prototype.intialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, returnMamChannel, itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadState()];
                    case 1:
                        _a.sent();
                        this._loggingService.log("consumer-init", "Registering with Grid");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "consumer", this._state && this._state.channel && this._state.channel.sideKey, this._state && this._state.channel && this._state.channel.initialRoot)];
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
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "consumer", this._state.channel.sideKey, this._state.channel.initialRoot)];
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
                        return [4 /*yield*/, storageConfigService.get("state")];
                    case 1:
                        _a._state = _b.sent();
                        this._loggingService.log("consumer", "Loaded State");
                        this._state = this._state || {};
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
                        return [4 /*yield*/, storageConfigService.set("state", this._state)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnN1bWVyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQTZEO0FBTzdELHlEQUF3RDtBQUV4RDs7R0FFRztBQUNIO0lBMEJJOzs7Ozs7T0FNRztJQUNILHlCQUNJLGNBQXNDLEVBQ3RDLFVBQThCO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1FBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIsdUJBQXVCLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsbUNBQVMsR0FBdEI7Ozs7OzRCQUNJLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7d0JBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO3dCQUVsRCxxQkFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakIsVUFBVSxFQUNWLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUNqRSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMs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