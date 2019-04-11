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
     * Get the state for the manager.
     */
    ProducerManager.prototype.getState = function () {
        return this._state;
    };
    /**
     * Initialise the producer by registering with the Grid.
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
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "producer", this._state && this._state.channel && this._state.channel.initialRoot, this._state && this._state.channel && this._state.channel.sideKey)];
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
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.initialRoot, this._state.channel.sideKey)];
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
                        return [4 /*yield*/, this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.initialRoot, this._state.channel.sideKey)];
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
                        return [4 /*yield*/, storageConfigService.get(this._config.id)];
                    case 1:
                        _a._state = _b.sent();
                        this._loggingService.log("producer", "Loaded State");
                        this._state = this._state || {
                            paymentSeed: trytesHelper_1.TrytesHelper.generateHash(),
                            paymentAddressIndex: 0,
                            lastOutputTime: Date.now(),
                            owedBalance: 0,
                            receivedBalance: 0
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
                        return [4 /*yield*/, storageConfigService.set(this._config.id, this._state)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y2VyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTZDO0FBQzdDLDhEQUE2RDtBQWE3RCxzREFBcUQ7QUFDckQseURBQXdEO0FBRXhEOztHQUVHO0FBQ0g7SUEwQkk7Ozs7T0FJRztJQUNILHlCQUFZLGNBQXNDLEVBQUUsVUFBOEI7UUFDOUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUF1Qix1QkFBdUIsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7T0FFRztJQUNJLGtDQUFRLEdBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ1Usb0NBQVUsR0FBdkI7Ozs7OzRCQUNJLHFCQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7d0JBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO3dCQUVuRSxxQkFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakIsVUFBVSxFQUNWLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxP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