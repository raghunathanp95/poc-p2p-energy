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
     * @param registration The registration details.
     */
    removeRegistration(registrationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const registration = yield this._registrationStorageService.get(registrationId);
            if (!registration) {
                throw new Error(`Registration '${registrationId}' does not exist.`);
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
                        const mamReturnChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
                        for (let i = 0; i < commands[registrationId].length; i++) {
                            yield mamReturnChannel.sendCommand(registration.returnMamChannel, commands[registrationId][i]);
                        }
                        yield this._registrationStorageService.set(registrationId, registration);
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