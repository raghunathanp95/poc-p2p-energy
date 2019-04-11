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
    function GridManager(nodeConfig) {
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
                        return [4 /*yield*/, storageConfigService.get("state")];
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
                        return [4 /*yield*/, storageConfigService.set("state", this._state)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF3QztBQUN4Qyw4REFBNkQ7QUFVN0Qsc0RBQXFEO0FBRXJEOztHQUVHO0FBQ0g7SUFnQkk7OztPQUdHO0lBQ0gscUJBQVksVUFBOEI7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVEsR0FBZjtRQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7O09BRUc7SUFDVSxnQ0FBVSxHQUF2Qjs7Ozs0QkFDSSxxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDO3dCQUN2QixxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDOzs7OztLQUMxQjtJQUVEOztPQUVHO0lBQ1UsK0JBQVMsR0FBdEI7Ozs7NEJBQ0kscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBdEIsU0FBc0IsQ0FBQzs7Ozs7S0FDMUI7SUFFRDs7OztPQUlHO0lBQ1Usb0NBQWMsR0FBM0IsVUFBNEIsWUFBMkIsRUFBRSxRQUF1Qjs7Ozs7O3dCQUN0RSxxQkFBcUIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBbUMsaUJBQWlCLENBQUMsQ0FBQzt3QkFDMUYscUJBQU0scUJBQXFCLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBQTs7d0JBQXhELEtBQUssR0FBRyxTQUFnRDt3QkFDeEQsWUFBWSxHQUFHLEtBQUssQ0FB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