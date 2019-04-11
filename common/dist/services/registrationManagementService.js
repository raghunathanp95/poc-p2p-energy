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
var RegistrationManagementService = /** @class */ (function () {
    /**
     * Initialise a new instance of RegistrationService.
     * @param nodeConfig The configuration.
     * @param shouldCreateReturnChannel The callback to determine when to create return mam channel.
     */
    function RegistrationManagementService(nodeConfig, shouldCreateReturnChannel) {
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
    RegistrationManagementService.prototype.addRegistration = function (registration, root, sideKey) {
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
    RegistrationManagementService.prototype.removeRegistration = function (registrationId) {
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
     * Load the registrations to initialise the queues.
     */
    RegistrationManagementService.prototype.loadRegistrations = function () {
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
    RegistrationManagementService.prototype.pollCommands = function (handleCommands) {
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
    RegistrationManagementService.prototype.openMamChannels = function (itemRoot, itemSideKey, registration) {
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
                            throw new Error("Unable to initialise mam channel for item, could not find initial 'hello' command.");
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
    RegistrationManagementService.prototype.closeMamChannels = function (registration) {
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
    RegistrationManagementService.prototype.getNewCommands = function (registration, handleCommands) {
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
    RegistrationManagementService.prototype.addQueueRegistration = function (registration) {
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
    RegistrationManagementService.prototype.removeQueueRegistration = function (registrationId) {
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
    return RegistrationManagementService;
}());
exports.RegistrationManagementService = RegistrationManagementService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uTWFuYWdlbWVudFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvcmVnaXN0cmF0aW9uTWFuYWdlbWVudFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQUE2RDtBQVE3RCx5REFBd0Q7QUFFeEQ7O0dBRUc7QUFDSDtJQStCSTs7OztPQUlHO0lBQ0gsdUNBQ0ksVUFBOEIsRUFDOUIseUJBQW1FO1FBQ25FLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQywwQkFBMEIsR0FBRyx5QkFBeUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsMkJBQTJCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlDLHNCQUFzQixDQUFDLENBQUM7SUFDbEgsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1UsdURBQWUsR0FBNUIsVUFBNkIsWUFBMkIsRUFBRSxJQUFZLEVBQUUsT0FBZTs7Ozs7O3dCQUNuRixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ2hELHFCQUFNLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFBOzt3QkFBbEYsb0JBQW9CLEdBQUcsU0FBMkQ7d0JBRXhGLElBQUksb0JBQW9CLEVBQUU7NEJBQ3RCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQzs0QkFDekUsWUFBWSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxJQUFJ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