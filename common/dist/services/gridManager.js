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
var core_1 = require("@iota/core");
var serviceFactory_1 = require("../factories/serviceFactory");
var trytesHelper_1 = require("../utils/trytesHelper");
/**
 * Service to handle the grid.
 */
var GridManager = /** @class */ (function () {
    /**
     * Create a new instance of GridService.
     * @param nodeConfig Configuration for tangle communication.
     */
    function GridManager(gridConfig, nodeConfig) {
        this._config = gridConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
    }
    /**
     * Get the state for the manager.
     */
    GridManager.prototype.getState = function () {
        return this._state;
    };
    /**
     * Initialise the grid.
     */
    GridManager.prototype.initialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadState()];
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
     * Closedown the grid.
     */
    GridManager.prototype.closedown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveState()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    GridManager.prototype.handleCommands = function (registration, commands) {
        return __awaiter(this, void 0, void 0, function () {
            var producerOutputService, store, updatedStore, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        producerOutputService = serviceFactory_1.ServiceFactory.get("producer-output");
                        return [4 /*yield*/, producerOutputService.get(registration.id)];
                    case 1:
                        store = _a.sent();
                        updatedStore = false;
                        _loop_1 = function (i) {
                            this_1._loggingService.log("grid", "Processing", commands[i]);
                            if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                                // This mam channel will have handled any mam operation
                                // at the moment there is nothing else for use to do
                            }
                            else if (commands[i].command === "output") {
                                var outputCommand_1 = commands[i];
                                if (!store) {
                                    store = {
                                        id: registration.id,
                                        output: []
                                    };
                                }
                                // Only store output commands that we havent already seen
                                if (!store.output.find(function (o) { return o.startTime === outputCommand_1.startTime; })) {
                                    store.output.push({
                                        startTime: outputCommand_1.startTime,
                                        endTime: outputCommand_1.endTime,
                                        output: outputCommand_1.output,
                                        producerAskingPrice: outputCommand_1.askingPrice,
                                        paymentAddress: outputCommand_1.paymentAddress
                                    });
                                    updatedStore = true;
                                }
                            }
                        };
                        this_1 = this;
                        for (i = 0; i < commands.length; i++) {
                            _loop_1(i);
                        }
                        if (!updatedStore) return [3 /*break*/, 3];
                        return [4 /*yield*/, producerOutputService.set(registration.id, store)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this._loggingService.log("grid", "Processed " + (commands ? commands.length : 0) + " commands for '" + registration.itemName + "'");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if payments have been confirmed for producer outputs.
     * @param calculatePrice Calculate a price based on the output details and asking price.
     */
    GridManager.prototype.calculateAskingPrices = function (calculatePrice) {
        return __awaiter(this, void 0, void 0, function () {
            var producerOutputService, pageSize, page, pageResponse, i, producer, updated, j, producerOutput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        producerOutputService = serviceFactory_1.ServiceFactory.get("producer-output");
                        pageSize = 10;
                        page = 0;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, producerOutputService.page(undefined, page, pageSize)];
                    case 2:
                        pageResponse = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < pageResponse.items.length)) return [3 /*break*/, 6];
                        producer = pageResponse.items[i];
                        if (!(producer.output && producer.output.length > 0)) return [3 /*break*/, 5];
                        updated = false;
                        for (j = 0; j < producer.output.length; j++) {
                            producerOutput = producer.output[j];
                            if (!producerOutput.gridActualPrice) {
                                this._loggingService.log("grid", "Calculate price for " + pageResponse.ids[i] + " at " + producerOutput.startTime);
                                updated = true;
                                producerOutput.gridActualPrice = calculatePrice(producerOutput.startTime, producerOutput.endTime, producerOutput.output, producerOutput.producerAskingPrice);
                            }
                        }
                        if (!updated) return [3 /*break*/, 5];
                        return [4 /*yield*/, producerOutputService.set(producer.id, producer)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        page++;
                        pageSize = pageResponse.pageSize;
                        _a.label = 7;
                    case 7:
                        if (pageResponse && pageResponse.ids && pageResponse.ids.length > 0) return [3 /*break*/, 1];
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if payments have been confirmed for producer outputs.
     */
    GridManager.prototype.checkPayments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var producerOutputService, producerOutputPaymentService, iota, toRemove, pageSize, page, pageResponse, i, producer, unpaid, j, producerOutput, confirmedBalances, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        producerOutputService = serviceFactory_1.ServiceFactory.get("producer-output");
                        producerOutputPaymentService = serviceFactory_1.ServiceFactory.get("producer-output-payment");
                        iota = core_1.composeAPI({
                            provider: this._nodeConfig.provider
                        });
                        toRemove = [];
                        pageSize = 10;
                        page = 0;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, producerOutputService.page(undefined, page, pageSize)];
                    case 2:
                        pageResponse = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < pageResponse.items.length)) return [3 /*break*/, 15];
                        producer = pageResponse.items[i];
                        if (!(producer.output && producer.output.length > 0)) return [3 /*break*/, 14];
                        unpaid = [];
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < producer.output.length)) return [3 /*break*/, 11];
                        producerOutput = producer.output[j];
                        if (!producerOutput.gridActualPrice) return [3 /*break*/, 9];
                        this._loggingService.log("grid", "Check payments for " + pageResponse.ids[i] + " at " + producerOutput.startTime);
                        return [4 /*yield*/, iota.getBalances([producerOutput.paymentAddress], 100)];
                    case 5:
                        confirmedBalances = _a.sent();
                        if (!(confirmedBalances &&
                            confirmedBalances.balances &&
                            confirmedBalances.balances.length > 0 &&
                            confirmedBalances.balances[0] === producerOutput.gridActualPrice)) return [3 /*break*/, 7];
                        // The confirmed balance on the address matches the
                        // actual price the grid was requesting, so move the output to
                        // the paid archive
                        this._loggingService.log("grid", "Payment for " + pageResponse.ids[i] + " on address " + producerOutput + " confirmed");
                        return [4 /*yield*/, producerOutputPaymentService.set(producer.id + "/" + producerOutput.startTime, {
                                startTime: producerOutput.startTime,
                                endTime: producerOutput.endTime,
                                output: producerOutput.output,
                                producerAskingPrice: producerOutput.producerAskingPrice,
                                paymentAddress: producerOutput.paymentAddress,
                                paymentBundles: []
                            })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        unpaid.push(producerOutput);
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        unpaid.push(producerOutput);
                        _a.label = 10;
                    case 10:
                        j++;
                        return [3 /*break*/, 4];
                    case 11:
                        if (!(unpaid.length === 0)) return [3 /*break*/, 12];
                        // No more unpaid entries so delete the producer output
                        toRemove.push(producer.id);
                        return [3 /*break*/, 14];
                    case 12:
                        // There are still unpaid outputs so update the item and save it
                        producer.output = unpaid;
                        return [4 /*yield*/, producerOutputService.set(producer.id, producer)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        i++;
                        return [3 /*break*/, 3];
                    case 15:
                        page++;
                        pageSize = pageResponse.pageSize;
                        _a.label = 16;
                    case 16:
                        if (pageResponse && pageResponse.ids && pageResponse.ids.length > 0) return [3 /*break*/, 1];
                        _a.label = 17;
                    case 17:
                        i = 0;
                        _a.label = 18;
                    case 18:
                        if (!(i < toRemove.length)) return [3 /*break*/, 21];
                        return [4 /*yield*/, producerOutputService.remove(toRemove[i])];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20:
                        i++;
                        return [3 /*break*/, 18];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove the state for the grid.
     */
    GridManager.prototype.removeState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("grid-storage-manager-state");
                        this._loggingService.log("grid", "Removing State");
                        return [4 /*yield*/, storageConfigService.remove(this._config.id)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("grid", "Removing State Complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load the state for the grid.
     */
    GridManager.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("grid-storage-manager-state");
                        this._loggingService.log("grid", "Loading State");
                        _a = this;
                        return [4 /*yield*/, storageConfigService.get(this._config.id)];
                    case 1:
                        _a._state = _b.sent();
                        this._loggingService.log("grid", "Loaded State");
                        this._state = this._state || {
                            paymentSeed: trytesHelper_1.TrytesHelper.generateHash(),
                            runningCostsBalance: 0,
                            producerPaidBalance: 0,
                            producerOwedBalance: 0,
                            consumerOwedBalance: 0,
                            consumerReceivedBalance: 0
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store the state for the grid.
     */
    GridManager.prototype.saveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("grid-storage-manager-state");
                        this._loggingService.log("grid", "Storing State");
                        return [4 /*yield*/, storageConfigService.set(this._config.id, this._state)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("grid", "Storing State Complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    return GridManager;
}());
exports.GridManager = GridManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF3QztBQUN4Qyw4REFBNkQ7QUFXN0Qsc0RBQXFEO0FBRXJEOztHQUVHO0FBQ0g7SUFxQkk7OztPQUdHO0lBQ0gscUJBQVksVUFBOEIsRUFBRSxVQUE4QjtRQUN0RSxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7O09BRUc7SUFDSSw4QkFBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNVLGdDQUFVLEdBQXZCOzs7OzRCQUNJLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7d0JBQ3ZCLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7Ozs7O0tBQzFCO0lBRUQ7O09BRUc7SUFDVSwrQkFBUyxHQUF0Qjs7Ozs0QkFDSSxxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDOzs7OztLQUMxQjtJQUVEOzs7O09BSUc7SUFDVSxvQ0FBYyxHQUEzQixVQUE0QixZQUEyQixFQUFFLFFBQXVCOzs7Ozs7d0JBQ3RFLHFCQUFxQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFtQyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUMxRixxQkFBTSxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFBOzt3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