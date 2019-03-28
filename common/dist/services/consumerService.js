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
var registrationApiClient_1 = require("./api/registrationApiClient");
var mamCommandChannel_1 = require("./mamCommandChannel");
/**
 * Class to handle a consumer.
 */
var ConsumerService = /** @class */ (function () {
    /**
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param gridApiEndpoint The grid api endpoint.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    function ConsumerService(consumerConfig, gridApiEndpoint, nodeConfig) {
        this._config = consumerConfig;
        this._gridApiEndpoint = gridApiEndpoint;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
    }
    /**
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    ConsumerService.prototype.intialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var registrationApiClient, response, returnMamChannel, itemMamChannel, updateResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registrationApiClient = new registrationApiClient_1.RegistrationApiClient(this._gridApiEndpoint);
                        return [4 /*yield*/, this.loadState()];
                    case 1:
                        _a.sent();
                        this._loggingService.log("consumer-init", "Registering with Grid");
                        return [4 /*yield*/, registrationApiClient.registrationSet({
                                registrationId: this._config.id,
                                itemName: this._config.name,
                                itemType: "consumer",
                                sideKey: this._state && this._state.channel && this._state.channel.sideKey,
                                root: this._state && this._state.channel && this._state.channel.initialRoot
                            })];
                    case 2:
                        response = _a.sent();
                        this._loggingService.log("consumer-init", "Registering with Grid: " + response.message);
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
                        return [4 /*yield*/, registrationApiClient.registrationSet({
                                registrationId: this._config.id,
                                sideKey: this._state.channel.sideKey,
                                root: this._state.channel.initialRoot
                            })];
                    case 7:
                        updateResponse = _a.sent();
                        this._loggingService.log("consumer-init", "Updating Registration: " + updateResponse.message + " ");
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
    ConsumerService.prototype.closedown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var registrationApiClient, itemMamChannel, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registrationApiClient = new registrationApiClient_1.RegistrationApiClient(this._gridApiEndpoint);
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
                        return [4 /*yield*/, registrationApiClient.registrationDelete({
                                registrationId: this._config.id
                            })];
                    case 3:
                        response = _a.sent();
                        this._loggingService.log("consumer-closedown", "Unregistering from the Grid: " + response.message + " ");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load the state for the consumer.
     */
    ConsumerService.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("storage-config");
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
    ConsumerService.prototype.saveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("storage-config");
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
    return ConsumerService;
}());
exports.ConsumerService = ConsumerService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnN1bWVyU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQTZEO0FBTTdELHFFQUFvRTtBQUNwRSx5REFBd0Q7QUFFeEQ7O0dBRUc7QUFDSDtJQTBCSTs7Ozs7OztPQU9HO0lBQ0gseUJBQ0ksY0FBc0MsRUFDdEMsZUFBdUIsRUFDdkIsVUFBOEI7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUN4QyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsbUNBQVMsR0FBdEI7Ozs7Ozt3QkFDVSxxQkFBcUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUUvRSxxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDO3dCQUV2QixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsQ0FBQzt3QkFFbEQscUJBQU0scUJBQXFCLENBQUMsZUFBZSxDQUFDO2dDQUN6RCxjQUFjLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dDQUMvQixRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dDQUMzQixRQUFRLEVBQUUsVUFBVTtnQ0FDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFD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