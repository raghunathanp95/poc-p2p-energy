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
 * Service to handle the registrations.
 */
var RegistrationService = /** @class */ (function () {
    /**
     * Initialise a new instance of RegistrationService.
     * @param nodeConfig The configuration.
     * @param shouldCreateReturnChannel The callback to determine when to create return mam channel.
     */
    function RegistrationService(nodeConfig, shouldCreateReturnChannel) {
        this._nodeConfig = nodeConfig;
        this._shouldCreateReturnChannel = shouldCreateReturnChannel;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationStorageService = serviceFactory_1.ServiceFactory.get("registration-storage");
    }
    /**
     * Add a new registration.
     * @param registration The registration details.
     * @param root The client mam channel root.
     * @param sideKey The client mam channel side key.
     */
    RegistrationService.prototype.addRegistration = function (registration, root, sideKey) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRegistration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._loggingService.log("registration", "add", registration, root, sideKey);
                        return [4 /*yield*/, this._registrationStorageService.get(registration.id)];
                    case 1:
                        existingRegistration = _a.sent();
                        if (existingRegistration) {
                            this._loggingService.log("registration", "exists", existingRegistration);
                            registration.itemName = registration.itemName || existingRegistration.itemName;
                            registration.itemType = registration.itemType || existingRegistration.itemType;
                            registration.itemMamChannel = existingRegistration.itemMamChannel;
                            registration.returnMamChannel = existingRegistration.returnMamChannel;
                        }
                        return [4 /*yield*/, this.openMamChannels(root, sideKey, registration)];
                    case 2:
                        _a.sent();
                        this._loggingService.log("registration", "open", registration);
                        return [4 /*yield*/, this._registrationStorageService.set(registration.id, registration)];
                    case 3:
                        _a.sent();
                        this.addQueueRegistration(registration);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove a registration from the service.
     * @param registration The registration details.
     */
    RegistrationService.prototype.removeRegistration = function (registrationId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._registrationStorageService.get(registrationId)];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            throw new Error("Registration '" + registrationId + "' does not exist.");
                        }
                        this.removeQueueRegistration(registrationId);
                        return [4 /*yield*/, this._registrationStorageService.remove(registrationId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.closeMamChannels(registration)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load the registrations to intialise the queues.
     */
    RegistrationService.prototype.loadRegistrations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page, pageSize, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._loggingService.log("registration", "Loading registrations");
                        this._allRegistrations = [];
                        page = 0;
                        pageSize = 20;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this._registrationStorageService.page(undefined, page, pageSize)];
                    case 2:
                        response = _a.sent();
                        if (response && response.items && response.items.length > 0) {
                            this._allRegistrations = this._allRegistrations.concat(response.items);
                            page++;
                        }
                        _a.label = 3;
                    case 3:
                        if (response && response.items && response.items.length > 0) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4:
                        this._registrationsQueue = [];
                        this._loggingService.log("registration", "Loaded " + this._allRegistrations.length + " registrations");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Look for new command for each registration.
     * @param handleCommands Handle any new commands found from the registration.
     */
    RegistrationService.prototype.pollCommands = function (handleCommands) {
        return __awaiter(this, void 0, void 0, function () {
            var nextRegistration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._allRegistrations.length > 0)) return [3 /*break*/, 2];
                        if (this._registrationsQueue.length === 0) {
                            this._registrationsQueue = this._allRegistrations.slice(0);
                        }
                        if (!(this._registrationsQueue.length > 0)) return [3 /*break*/, 2];
                        nextRegistration = this._registrationsQueue.shift();
                        return [4 /*yield*/, this.getNewCommands(nextRegistration, handleCommands)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Build the mam channels for the registration.
     * @param itemRoot The root passed from the client.
     * @param itemSideKey The side key passed from the client.
     * @param registration The registration object to build.
     */
    RegistrationService.prototype.openMamChannels = function (itemRoot, itemSideKey, registration) {
        return __awaiter(this, void 0, void 0, function () {
            var currentItemRoot, currentItemSideKey, itemMamChannelConfiguration, itemMamChannel, openSuccess, returnMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(itemRoot && itemSideKey)) return [3 /*break*/, 4];
                        currentItemRoot = registration.itemMamChannel && registration.itemMamChannel.initialRoot;
                        currentItemSideKey = registration.itemMamChannel && registration.itemMamChannel.sideKey;
                        if (!(currentItemRoot !== itemRoot || currentItemSideKey !== itemSideKey)) return [3 /*break*/, 2];
                        this._loggingService.log("registration", "Initialising item channel");
                        itemMamChannelConfiguration = {
                            initialRoot: itemRoot,
                            sideKey: itemSideKey
                        };
                        itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, itemMamChannel.openReadable(itemMamChannelConfiguration)];
                    case 1:
                        openSuccess = _a.sent();
                        if (!openSuccess) {
                            throw new Error("Unable to intialise mam channel for item, could not find initial 'hello' command.");
                        }
                        registration.itemMamChannel = itemMamChannelConfiguration;
                        this._loggingService.log("registration", "Initialising item channel complete");
                        _a.label = 2;
                    case 2:
                        if (!(registration.returnMamChannel === undefined && this._shouldCreateReturnChannel(registration))) return [3 /*break*/, 4];
                        this._loggingService.log("registration", "Generating return channel hello");
                        returnMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        registration.returnMamChannel = {};
                        return [4 /*yield*/, returnMamChannel.openWritable(registration.returnMamChannel)];
                    case 3:
                        _a.sent();
                        this._loggingService.log("registration", "Generating return channel hello complete");
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Close the mam channels that are open.
     * @param registration The registration to close the channels for.
     */
    RegistrationService.prototype.closeMamChannels = function (registration) {
        return __awaiter(this, void 0, void 0, function () {
            var gridMamChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!registration.returnMamChannel) return [3 /*break*/, 2];
                        gridMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, gridMamChannel.closeWritable(registration.returnMamChannel)];
                    case 1:
                        _a.sent();
                        registration.returnMamChannel = undefined;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the new command for a registration.
     * @param registration The registration to update.
     * @returns Log of process.
     */
    RegistrationService.prototype.getNewCommands = function (registration, handleCommands) {
        return __awaiter(this, void 0, void 0, function () {
            var mamChannel, commands;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!registration.itemMamChannel) return [3 /*break*/, 4];
                        mamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                        return [4 /*yield*/, mamChannel.receiveCommands(registration.itemMamChannel)];
                    case 1:
                        commands = _a.sent();
                        if (!(commands && commands.length > 0)) return [3 /*break*/, 4];
                        // Has the channel been reset by one of the commands
                        if (registration.itemMamChannel.initialRoot && registration.itemMamChannel.sideKey === undefined) {
                            registration.itemMamChannel = undefined;
                        }
                        // If we retrieved new commands make sure we save the state
                        // for the updated mam channel, this will also save the reset details
                        return [4 /*yield*/, this._registrationStorageService.set(registration.id, registration)];
                    case 2:
                        // If we retrieved new commands make sure we save the state
                        // for the updated mam channel, this will also save the reset details
                        _a.sent();
                        return [4 /*yield*/, handleCommands(registration, commands)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add a registration to the queues.
     * @param registration The registrations to add.
     */
    RegistrationService.prototype.addQueueRegistration = function (registration) {
        this.removeQueueRegistration(registration.id);
        // We need to add the new item into work queue if it doesn't already exist
        // as we only read the registrations form the db on startup
        this._allRegistrations = this._allRegistrations || [];
        this._registrationsQueue = this._registrationsQueue || [];
        this._allRegistrations.push(registration);
        this._registrationsQueue.push(registration);
    };
    /**
     * Remove registration from the queues if they exist.
     * @param registrationId The registration to remove.
     */
    RegistrationService.prototype.removeQueueRegistration = function (registrationId) {
        if (this._allRegistrations) {
            var idx = this._allRegistrations.findIndex(function (r) { return r.id === registrationId; });
            if (idx >= 0) {
                this._allRegistrations.splice(idx, 1);
            }
        }
        if (this._registrationsQueue) {
            var idx2 = this._registrationsQueue.findIndex(function (r) { return r.id === registrationId; });
            if (idx2 >= 0) {
                this._registrationsQueue.splice(idx2, 1);
            }
        }
    };
    return RegistrationService;
}());
exports.RegistrationService = RegistrationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9yZWdpc3RyYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBNkQ7QUFRN0QseURBQXdEO0FBRXhEOztHQUVHO0FBQ0g7SUErQkk7Ozs7T0FJRztJQUNILDZCQUNJLFVBQThCLEVBQzlCLHlCQUFtRTtRQUNuRSxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsMEJBQTBCLEdBQUcseUJBQXlCLENBQUM7UUFDNUQsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLDJCQUEyQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFpQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2xILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNVLDZDQUFlLEdBQTVCLFVBQTZCLFlBQTJCLEVBQUUsSUFBWSxFQUFFLE9BQWU7Ozs7Ozt3QkFDbkYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUNoRCxxQkFBTSxJQUFJLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBQTs7d0JBQWxGLG9CQUFvQixHQUFHLFNBQTJEO3dCQUV4RixJQUFJLG9CQUFvQixFQUFFOzRCQUN0QixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7NEJBQ3pFLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLENB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