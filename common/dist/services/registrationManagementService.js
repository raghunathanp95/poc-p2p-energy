"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const serviceFactory_1 = require("../factories/serviceFactory");
const mamCommandChannel_1 = require("./mamCommandChannel");
/**
 * Service to handle the registrations.
 */
class RegistrationManagementService {
    /**
     * Initialise a new instance of RegistrationService.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param shouldCreateReturnChannel The callback to determine when to create return mam channel.
     */
    constructor(loadBalancerSettings, shouldCreateReturnChannel) {
        this._loadBalancerSettings = loadBalancerSettings;
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
    addRegistration(registration, root, sideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this._loggingService.log("registration", "add", registration, root, sideKey);
            const existingRegistration = yield this._registrationStorageService.get(registration.id);
            if (existingRegistration) {
                this._loggingService.log("registration", "exists", existingRegistration);
                registration.itemName = registration.itemName || existingRegistration.itemName;
                registration.itemType = registration.itemType || existingRegistration.itemType;
                registration.itemMamChannel = existingRegistration.itemMamChannel;
                registration.returnMamChannel = existingRegistration.returnMamChannel;
            }
            yield this.openMamChannels(root, sideKey, registration);
            this._loggingService.log("registration", "open", registration);
            yield this._registrationStorageService.set(registration.id, registration);
            // Add it to the internal list if it doesn't exist
            const idx = this._registrations.findIndex(r => r.id === registration.id);
            if (idx < 0) {
                this._registrations.push(registration);
            }
            else {
                // Or update it if it does
                this._registrations[idx] = registration;
            }
        });
    }
    /**
     * Remove a registration from the service.
     * @param registrationId The id of the registration.
     * @param sideKey The client mam channel side key used for remove validation.
     */
    removeRegistration(registrationId, sideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const registration = yield this._registrationStorageService.get(registrationId);
            if (!registration) {
                throw new Error(`Registration '${registrationId}' does not exist.`);
            }
            if (registration.itemMamChannel && registration.itemMamChannel.sideKey !== sideKey) {
                throw new Error(`Registration '${registrationId}' sideKey failure.`);
            }
            // Remove if from the internal list if it exists
            const idx = this._registrations.findIndex(r => r.id === registration.id);
            if (idx >= 0) {
                this._registrations.splice(idx, 1);
            }
            yield this._registrationStorageService.remove(registrationId);
            yield this.closeMamChannels(registration);
        });
    }
    /**
     * Load the registrations to initialise the queues.
     */
    loadRegistrations() {
        return __awaiter(this, void 0, void 0, function* () {
            this._loggingService.log("registration", `Loading registrations`);
            this._registrations = [];
            let page = 0;
            const pageSize = 20;
            let response;
            do {
                response = yield this._registrationStorageService.page(undefined, page, pageSize);
                if (response && response.items && response.items.length > 0) {
                    this._registrations = this._registrations.concat(response.items);
                    page++;
                }
            } while (response && response.items && response.items.length > 0);
            this._loggingService.log("registration", `Loaded ${this._registrations.length} registrations`);
        });
    }
    /**
     * Look for new command for each registration.
     * @param handleCommands Handle any new commands found from the registration.
     */
    pollCommands(handleCommands) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this._registrations.length; i++) {
                yield this.getNewCommands(this._registrations[i], handleCommands);
            }
        });
    }
    /**
     * Send commands to the return channel.
     * @param commands The commands to return to the registrations.
     */
    returnCommands(commands) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const registrationId in commands) {
                const registration = this._registrations.find(r => r.id === registrationId);
                if (registration) {
                    if (registration && registration.returnMamChannel) {
                        registration.unsentReturnCommands = registration.unsentReturnCommands || [];
                        registration.unsentReturnCommands =
                            registration.unsentReturnCommands.concat(commands[registrationId]);
                        if (registration.unsentReturnCommands.length > 0) {
                            const mamReturnChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                            registration.unsentReturnCommands = yield mamReturnChannel.sendCommandQueue(registration.returnMamChannel, registration.unsentReturnCommands);
                            yield this._registrationStorageService.set(registrationId, registration);
                        }
                    }
                }
            }
        });
    }
    /**
     * Build the mam channels for the registration.
     * @param itemRoot The root passed from the client.
     * @param itemSideKey The side key passed from the client.
     * @param registration The registration object to build.
     */
    openMamChannels(itemRoot, itemSideKey, registration) {
        return __awaiter(this, void 0, void 0, function* () {
            // We only build mam channels if the registering entity has sent details
            if (itemRoot && itemSideKey) {
                const currentItemRoot = registration.itemMamChannel && registration.itemMamChannel.initialRoot;
                const currentItemSideKey = registration.itemMamChannel && registration.itemMamChannel.sideKey;
                // Only setup again if its different to current.
                if (currentItemRoot !== itemRoot || currentItemSideKey !== itemSideKey) {
                    this._loggingService.log("registration", `Initialising item channel`);
                    const itemMamChannelConfiguration = {
                        initialRoot: itemRoot,
                        sideKey: itemSideKey
                    };
                    const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                    const openSuccess = yield itemMamChannel.openReadable(itemMamChannelConfiguration);
                    if (!openSuccess) {
                        throw new Error("Unable to initialise mam channel for item, could not find initial 'hello' command.");
                    }
                    registration.itemMamChannel = itemMamChannelConfiguration;
                    this._loggingService.log("registration", `Initialising item channel complete`);
                }
            }
            if (registration.returnMamChannel === undefined && this._shouldCreateReturnChannel(registration)) {
                this._loggingService.log("registration", `Generating return channel hello`);
                const returnMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                registration.returnMamChannel = {};
                yield returnMamChannel.openWritable(registration.returnMamChannel);
                this._loggingService.log("registration", `Generating return channel hello complete`);
            }
        });
    }
    /**
     * Close the mam channels that are open.
     * @param registration The registration to close the channels for.
     */
    closeMamChannels(registration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (registration.returnMamChannel) {
                const gridMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                yield gridMamChannel.closeWritable(registration.returnMamChannel);
                registration.returnMamChannel = undefined;
            }
        });
    }
    /**
     * Get the new command for a registration.
     * @param registration The registration to update.
     * @param handleCommands Handle any new commands found from the registration.
     */
    getNewCommands(registration, handleCommands) {
        return __awaiter(this, void 0, void 0, function* () {
            if (registration.itemMamChannel) {
                const mamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                const commands = yield mamChannel.receiveCommands(registration.itemMamChannel);
                if (commands && commands.length > 0) {
                    // Has the channel been reset by one of the commands
                    if (registration.itemMamChannel.initialRoot && registration.itemMamChannel.sideKey === undefined) {
                        registration.itemMamChannel = undefined;
                    }
                    // If we retrieved new commands make sure we save the state
                    // for the updated mam channel, this will also save the reset details
                    yield this._registrationStorageService.set(registration.id, registration);
                    yield handleCommands(registration, commands);
                }
            }
        });
    }
}
exports.RegistrationManagementService = RegistrationManagementService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uTWFuYWdlbWVudFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvcmVnaXN0cmF0aW9uTWFuYWdlbWVudFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGdFQUE2RDtBQU83RCwyREFBd0Q7QUFFeEQ7O0dBRUc7QUFDSCxNQUFhLDZCQUE2QjtJQTBCdEM7Ozs7T0FJRztJQUNILFlBQ0ksb0JBQTBDLEVBQzFDLHlCQUFtRTtRQUNuRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLDBCQUEwQixHQUFHLHlCQUF5QixDQUFDO1FBQzVELElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQywyQkFBMkIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBaUMsc0JBQXNCLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVSxlQUFlLENBQUMsWUFBMkIsRUFBRSxJQUFZLEVBQUUsT0FBZTs7WUFDbkYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdFLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxJQUFJLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV6RixJQUFJLG9CQUFvQixFQUFFO2dCQUN0QixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7Z0JBQ3pFLFlBQVksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLENBQUM7Z0JBQy9FLFlBQVks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