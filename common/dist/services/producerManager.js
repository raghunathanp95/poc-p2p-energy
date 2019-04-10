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
var mamCommandChannel_1 = require("./mamCommandChannel");
/**
 * Class to maintain a Producer.
 */
var ProducerManager = /** @class */ (function () {
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param nodeConfig The configuration for a tangle node.
     */
    function ProducerManager(producerConfig, nodeConfig) {
        this._config = producerConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("producer-registration");
    }
    /**
     * Intialise the producer by registering with the Grid.
     */
    ProducerManager.prototype.initialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadState()];
                    case 1:
                        _a.sent();
                        this._loggingService.log("producer-init", "Registering with Grid");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "producer", this._state && this._state.channel && this._state.channel.sideKey, this._state && this._state.channel && this._state.channel.initialRoot)];
                    case 2:
                        _a.sent();
                        this._loggingService.log("producer-init", "Registered with Grid");
                        if (!this._state.channel) return [3 /*break*/, 3];
                        this._loggingService.log("producer-init", "Channel Config already exists");
                        return [3 /*break*/, 6];
                    case 3:
                        this._loggingService.log("producer-init", "Channel Config not found");
                        this._loggingService.log("producer-init", "Creating Channel");
                        itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        this._state.channel = {};
                        return [4 /*yield*/, itemMamChannel.openWritable(this._state.channel)];
                    case 4:
                        _a.sent();
                        this._loggingService.log("producer-init", "Creating Channel Success");
                        this._loggingService.log("producer-init", "Updating Registration");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.sideKey, this._state.channel.initialRoot)];
                    case 5:
                        _a.sent();
                        this._loggingService.log("producer-init", "Updated Registration");
                        _a.label = 6;
                    case 6:
                        this._loggingService.log("producer-init", "Registration Complete");
                        return [4 /*yield*/, this.saveState()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reset the producer channel.
     */
    ProducerManager.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mamCommandChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._state && this._state.channel)) return [3 /*break*/, 4];
                        this._loggingService.log("producer-reset", "Send Channel Reset");
                        mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, mamCommandChannel.reset(this._state.channel)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.saveState()];
                    case 2:
                        _a.sent();
                        this._loggingService.log("producer-reset", "Updating Registration with Grid");
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.sideKey, this._state.channel.initialRoot)];
                    case 3:
                        _a.sent();
                        this._loggingService.log("producer-reset", "Updated Registration with Grid");
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Closedown the producer by unregistering from the Grid.
     */
    ProducerManager.prototype.closedown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var itemMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._state && this._state.channel)) return [3 /*break*/, 2];
                        this._loggingService.log("producer-closedown", "Sending Goodbye");
                        itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, itemMamChannel.closeWritable(this._state.channel)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("producer-closedown", "Sending Goodbye Complete");
                        this._state.channel = undefined;
                        _a.label = 2;
                    case 2:
                        this._loggingService.log("producer-closedown", "Unregistering from the Grid");
                        return [4 /*yield*/, this._registrationService.unregister(this._config.id)];
                    case 3:
                        _a.sent();
                        this._loggingService.log("producer-closedown", "Unregistered from the Grid");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Combine the information from the sources and generate an output command.
     * @param calculatePrice Calculate the price for an output.
     */
    ProducerManager.prototype.collateSources = function (calculatePrice) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceStoreService, paymentAddress, sources, startTime, endTime, totalOutput, idsToRemove, page, i, sourceStore, remaining, j, totalTime, totalTimeUsed, totalTimeUsedPercent, totalUsedOutput, i, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._state && this._state.channel)) return [3 /*break*/, 17];
                        sourceStoreService = serviceFactory_1.ServiceFactory.get("source-store");
                        paymentAddress = core_1.generateAddress(this._state.paymentSeed, this._state.paymentAddressIndex, 2);
                        this._state.paymentAddressIndex++;
                        sources = void 0;
                        startTime = this._state.lastOutputTime + 1;
                        endTime = Date.now();
                        totalOutput = 0;
                        idsToRemove = [];
                        page = 0;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, sourceStoreService.page(undefined, page, 20)];
                    case 2:
                        // Get the sources page at a time
                        sources = _a.sent();
                        if (!(sources && sources.items)) return [3 /*break*/, 7];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < sources.items.length)) return [3 /*break*/, 7];
                        sourceStore = sources.items[i];
                        remaining = [];
                        // Are there output entries in the source
                        if (sourceStore.output) {
                            // Walk the outputs from the source
                            for (j = 0; j < sourceStore.output.length; j++) {
                                // Does the output from the source overlap
                                // with our current collated block
                                if (sourceStore.output[j].startTime < endTime) {
                                    totalTime = sourceStore.output[j].endTime - sourceStore.output[j].startTime;
                                    totalTimeUsed = Math.min(endTime, sourceStore.output[j].endTime) -
                                        sourceStore.output[j].startTime;
                                    totalTimeUsedPercent = totalTimeUsed / totalTime;
                                    totalUsedOutput = totalTimeUsedPercent * sourceStore.output[j].output;
                                    totalOutput += totalUsedOutput;
                                    // Is there any time remaining in the block
                                    if (totalTimeUsed < totalTime) {
                                        // Added a new source block that starts after
                                        // the current collated block and with the output reduced
                                        // by the amount we have collated
                                        remaining.push({
                                            startTime: endTime + 1,
                                            endTime: sourceStore.output[j].endTime,
                                            output: sourceStore.output[j] - totalUsedOutput
                                        });
                                    }
                                }
                                else {
                                    // No overlap so just store the block
                                    remaining.push(sourceStore.output[j]);
                                }
                            }
                        }
                        if (!(remaining.length === 0)) return [3 /*break*/, 4];
                        // If there are no more outputs in the source remove the storage for it
                        idsToRemove.push(sources.ids[i]);
                        return [3 /*break*/, 6];
                    case 4:
                        // There are remaining source outputs so save them
                        sourceStore.output = remaining;
                        return [4 /*yield*/, sourceStoreService.set(sources.ids[i], sourceStore)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7:
                        page++;
                        _a.label = 8;
                    case 8:
                        if (sources && sources.items && sources.items.length > 0) return [3 /*break*/, 1];
                        _a.label = 9;
                    case 9:
                        i = 0;
                        _a.label = 10;
                    case 10:
                        if (!(i < idsToRemove.length)) return [3 /*break*/, 13];
                        return [4 /*yield*/, sourceStoreService.remove(idsToRemove[i])];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        i++;
                        return [3 /*break*/, 10];
                    case 13:
                        this._state.lastOutputTime = endTime;
                        if (!(totalOutput > 0)) return [3 /*break*/, 15];
                        command = {
                            command: "output",
                            startTime: startTime,
                            endTime: endTime,
                            askingPrice: calculatePrice(startTime, endTime, totalOutput),
                            output: totalOutput,
                            paymentAddress: paymentAddress
                        };
                        return [4 /*yield*/, this.sendCommand(command)];
                    case 14:
                        _a.sent();
                        return [3 /*break*/, 17];
                    case 15: return [4 /*yield*/, this.saveState()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    ProducerManager.prototype.handleCommands = function (registration, commands) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceStoreService, store, updatedStore, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceStoreService = serviceFactory_1.ServiceFactory.get("source-store");
                        return [4 /*yield*/, sourceStoreService.get(registration.id)];
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
                                        output: outputCommand_1.output
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
                        return [4 /*yield*/, sourceStoreService.set(registration.id, store)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this._loggingService.log("producer", "Processed " + (commands ? commands.length : 0) + " commands for '" + registration.itemName + "'");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send a command to the channel.
     */
    ProducerManager.prototype.sendCommand = function (command) {
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
    ProducerManager.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("producer-storage-manager-state");
                        this._loggingService.log("producer", "Loading State");
                        _a = this;
                        return [4 /*yield*/, storageConfigService.get(this._config.id + "/state")];
                    case 1:
                        _a._state = _b.sent();
                        this._loggingService.log("producer", "Loaded State");
                        this._state = this._state || {
                            paymentSeed: trytesHelper_1.TrytesHelper.generateHash(),
                            paymentAddressIndex: 0,
                            lastOutputTime: Date.now()
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store the state for the producer.
     */
    ProducerManager.prototype.saveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageConfigService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageConfigService = serviceFactory_1.ServiceFactory.get("producer-storage-manager-state");
                        this._loggingService.log("producer", "Storing State");
                        return [4 /*yield*/, storageConfigService.set(this._config.id + "/state", this._state)];
                    case 1:
                        _a.sent();
                        this._loggingService.log("producer", "Storing State Complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProducerManager;
}());
exports.ProducerManager = ProducerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y2VyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTZDO0FBQzdDLDhEQUE2RDtBQWE3RCxzREFBcUQ7QUFDckQseURBQXdEO0FBRXhEOztHQUVHO0FBQ0g7SUEwQkk7Ozs7T0FJRztJQUNILHlCQUFZLGNBQXNDLEVBQUUsVUFBOEI7UUFDOUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUF1Qix1QkFBdUIsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7T0FFRztJQUNVLG9DQUFVLEdBQXZCOzs7Ozs0QkFDSSxxQkFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDO3dCQUV2QixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsQ0FBQzt3QkFFbkUscUJBQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pCLFVBQVUsRUFDVixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFDakUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFB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