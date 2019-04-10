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
     * Intialise the grid.
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
                            paymentSeed: trytesHelper_1.TrytesHelper.generateHash()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZ3JpZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF3QztBQUN4Qyw4REFBNkQ7QUFVN0Qsc0RBQXFEO0FBRXJEOztHQUVHO0FBQ0g7SUFnQkk7OztPQUdHO0lBQ0gscUJBQVksVUFBOEI7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOztPQUVHO0lBQ1UsZ0NBQVUsR0FBdkI7Ozs7NEJBQ0kscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBdEIsU0FBc0IsQ0FBQzt3QkFDdkIscUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFBdEIsU0FBc0IsQ0FBQzs7Ozs7S0FDMUI7SUFFRDs7T0FFRztJQUNVLCtCQUFTLEdBQXRCOzs7OzRCQUNJLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7Ozs7O0tBQzFCO0lBRUQ7Ozs7T0FJRztJQUNVLG9DQUFjLEdBQTNCLFVBQTRCLFlBQTJCLEVBQUUsUUFBdUI7Ozs7Ozt3QkFDdEUscUJBQXFCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQW1DLGlCQUFpQixDQUFDLENBQUM7d0JBQzFGLHFCQUFNLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUE7O3dCQUF4RCxLQUFLLEdBQUcsU0FBZ0Q7d0JBQ3hELFlBQVksR0FBRyxLQUFLLENBQUM7NENBRWhCLENBQUM7NEJBQ04sT0FBSyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzVELElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0NBQ3RFLHVEQUF1RDtnQ0FDdkQsb0RBQW9EOzZCQUN2RDtpQ0FBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO2dDQUN6QyxJQUFNLGVBQWEsR0FBMkIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUUxRCxJQUFJLENBQUMsS0FBSyxFQUFFO29DQUNSLEtBQUssR0FBRzt3Q0FDSixFQUFFLEVBQUUsWUFBWSxDQUFDLEVBQUU7d0NBQ25CLE1BQU0sRUFBRSxFQUFFO3FDQUNiLENBQUM7aUNBQ0w7Z0NBRUQseURBQXlEO2dDQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsU0FBUyxLQUFLLGVBQWEsQ0FBQyxTQUFTLEVBQXZDLENBQXVDLENBQUMsRUFBRTtvQ0FDbEUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7d0NBQ2QsU0FBUyxFQUFFLGVBQWEsQ0FBQyxTQUFTO3dDQUNsQyxPQUFPLEVBQUUsZUFBYSxDQUFDLE9BQU87d0NBQzlCLE1BQU0sRUFBRSxlQUFhLENBQUMsTUFBTTt3Q0FDNUIsbUJBQW1CLEVBQUUsZUFBYSxDQUFDLFdBQVc7d0NBQzlDLGNBQWMsRUFBRSxlQUFhLENBQUMsY0FBYztxQ0FDL0MsQ0FBQyxDQUFDO29DQUVILFlBQVksR0FBRyxJQUFJLENBQUM7aUNBQ3ZCOzZCQUNKOzs7d0JBM0JMLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7b0NBQS9CLENBQUM7eUJBNEJUOzZCQUVHLFlBQVksRUFBWix3QkFBWTt3QkFDWixxQkFBTSxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBQTs7d0JBQXZELFNBQXVELENBQUM7Ozt3QkFHNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQ3BCLE1BQU0sRUFDTixnQkFBYSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQWtCLFlBQVksQ0FBQyxRQUFRLE1BQUcsQ0FDeEYsQ0FBQzs7Ozs7S0FDTDtJQUVEOzs7T0FHRztJQUNVLDJDQUFxQixHQUFsQyxVQUNJLGNBQW1HOzs7Ozs7d0JBRTdGLHFCQUFxQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFtQyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUVsRyxRQUFRLEdBQUcsRUFBRSxDQUFDO3dCQUNkLElBQUksR0FBRyxDQUFDLENBQUM7OzRCQUdNLHFCQUFNLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFBOzt3QkFBMUUsWUFBWSxHQUFHLFNBQTJELENBQUM7d0JBRWxFLENBQUMsR0FBRyxDQUFDOzs7NkJBQUUsQ0FBQSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUE7d0JBQ25DLFFBQVEsR0FBb0IsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDcEQsQ0FBQSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxFQUE3Qyx3QkFBNkM7d0JBQ3pDLE9BQU8sR0FBRyxLQUFLLENBQUM7d0JBRXBCLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3ZDLGNBQWMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtnQ0FDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQ3BCLE1BQU0sRUFDTix5QkFBdUIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBTyxjQUFjLENBQUMsU0FBVyxDQUM5RSxDQUFDO2dDQUNGLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0NBQ2YsY0FBYyxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQzNDLGNBQWMsQ0FBQyxTQUFTLEVBQ3hCLGNBQWMsQ0FBQyxPQUFPLEVBQ3RCLGNBQWMsQ0FBQyxNQUFNLEVBQ3JCLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzZCQUMzQzt5QkFDSjs2QkFDRyxPQUFPLEVBQVAsd0JBQU87d0JBQ1AscUJBQU0scUJBQXFCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUE7O3dCQUF0RCxTQUFzRCxDQUFDOzs7d0JBckJwQixDQUFDLEVBQUUsQ0FBQTs7O3dCQXlCbEQsSUFBSSxFQUFFLENBQUM7d0JBQ1AsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7Ozs0QkFDNUIsWUFBWSxJQUFJLFlBQVksQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQzs7Ozs7O0tBQzNFO0lBRUQ7O09BRUc7SUFDVSxtQ0FBYSxHQUExQjs7Ozs7O3dCQUNVLHFCQUFxQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFtQyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUNoRyw0QkFBNEIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDbkQseUJBQXlCLENBQUMsQ0FBQzt3QkFFekIsSUFBSSxHQUFHLGlCQUFVLENBQUM7NEJBQ3BCLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVE7eUJBQ3RDLENBQUMsQ0FBQzt3QkFFRyxRQUFRLEdBQUcsRUFBRSxDQUFDO3dCQUVoQixRQUFRLEdBQUcsRUFBRSxDQUFDO3dCQUNkLElBQUksR0FBRyxDQUFDLENBQUM7OzRCQUdNLHFCQUFNLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFBOzt3QkFBMUUsWUFBWSxHQUFHLFNBQTJELENBQUM7d0JBRWxFLENBQUMsR0FBRyxDQUFDOzs7NkJBQUUsQ0FBQSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUE7d0JBQ25DLFFBQVEsR0FBb0IsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDcEQsQ0FBQSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxFQUE3Qyx5QkFBNkM7d0JBQ3ZDLE1BQU0sR0FBRyxFQUFFLENBQUM7d0JBQ1QsQ0FBQyxHQUFHLENBQUM7Ozs2QkFBRSxDQUFBLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTt3QkFDaEMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ3RDLGNBQWMsQ0FBQyxlQUFlLEVBQTlCLHdCQUE4Qjt3QkFDOUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQ3BCLE1BQU0sRUFDTix3QkFBc0IsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBTyxjQUFjLENBQUMsU0FBVyxDQUM3RSxDQUFDO3dCQUV3QixxQkFBTSxJQUFJLENBQUMsV0FBVyxDQUM1QyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFDL0IsR0FBRyxDQUFDLEVBQUE7O3dCQUZGLGlCQUFpQixHQUFHLFNBRWxCOzZCQUVKLENBQUEsaUJBQWlCOzRCQUNqQixpQkFBaUIsQ0FBQyxRQUFROzRCQUMxQixpQkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7NEJBQ3JDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxjQUFjLENBQUMsZUFBZSxDQUFBLEVBSGhFLHdCQUdnRTt3QkFDaEUsbURBQW1EO3dCQUNuRCw4REFBOEQ7d0JBQzlELG1CQUFtQjt3QkFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQ3BCLE1BQU0sRUFDTixpQkFBZSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBZSxjQUFjLGVBQVksQ0FDOUUsQ0FBQzt3QkFFRixxQkFBTSw0QkFBNEIsQ0FBQyxHQUFHLENBQy9CLFFBQVEsQ0FBQyxFQUFFLFNBQUksY0FBYyxDQUFDLFNBQVcsRUFDNUM7Z0NBQ0ksU0FBUyxFQUFFLGNBQWMsQ0FBQyxTQUFTO2dDQUNuQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU87Z0NBQy9CLE1BQU0sRUFBRSxjQUFjLENBQUMsTUFBTTtnQ0FDN0IsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLG1CQUFtQjtnQ0FDdkQsY0FBYyxFQUFFLGNBQWMsQ0FBQyxjQUFjO2dDQUM3QyxjQUFjLEVBQUUsRUFBRTs2QkFDckIsQ0FBQyxFQUFBOzt3QkFUTixTQVNNLENBQUM7Ozt3QkFFUCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDOzs7O3dCQUdoQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDOzs7d0JBdENRLENBQUMsRUFBRSxDQUFBOzs7NkJBeUMzQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFBLEVBQW5CLHlCQUFtQjt3QkFDbkIsdURBQXVEO3dCQUN2RCxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O3dCQUUzQixnRUFBZ0U7d0JBQ2hFLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO3dCQUN6QixxQkFBTSxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBQTs7d0JBQXRELFNBQXNELENBQUM7Ozt3QkFuRHBCLENBQUMsRUFBRSxDQUFBOzs7d0JBdURsRCxJQUFJLEVBQUUsQ0FBQzt3QkFDUCxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQzs7OzRCQUM1QixZQUFZLElBQUksWUFBWSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDOzs7d0JBRS9ELENBQUMsR0FBRyxDQUFDOzs7NkJBQUUsQ0FBQSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQTt3QkFDL0IscUJBQU0scUJBQXFCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFBL0MsU0FBK0MsQ0FBQzs7O3dCQURmLENBQUMsRUFBRSxDQUFBOzs7Ozs7S0FHM0M7SUFFRDs7T0FFRztJQUNXLCtCQUFTLEdBQXZCOzs7Ozs7d0JBQ1Usb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQzNDLDRCQUE0QixDQUFDLENBQUM7d0JBRWxDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFDbEQsS0FBQSxJQUFJLENBQUE7d0JBQVUscUJBQU0sb0JBQW9CLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFBOzt3QkFBckQsR0FBSyxNQUFNLEdBQUcsU0FBdUMsQ0FBQzt3QkFDdEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO3dCQUVqRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUk7NEJBQ3pCLFdBQVcsRUFBRSwyQkFBWSxDQUFDLFlBQVksRUFBRTt5QkFDM0MsQ0FBQzs7Ozs7S0FDTDtJQUVEOztPQUVHO0lBQ1csK0JBQVMsR0FBdkI7Ozs7Ozt3QkFDVSxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FDM0MsNEJBQTRCLENBQUMsQ0FBQzt3QkFFbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUNsRCxxQkFBTSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQXBELFNBQW9ELENBQUM7d0JBQ3JELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDOzs7OztLQUM5RDtJQUNMLGtCQUFDO0FBQUQsQ0FBQyxBQXRQRCxJQXNQQztBQXRQWSxrQ0FBVyJ9