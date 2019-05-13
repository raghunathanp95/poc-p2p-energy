import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { ServiceFactory } from "../factories/serviceFactory";
import { IMamChannelConfiguration } from "../models/mam/IMamChannelConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { IRegistrationManagementService } from "../models/services/IRegistrationManagementService";
import { IStorageService } from "../models/services/IStorageService";
import { IRegistration } from "../models/services/registration/IRegistration";
import { MamCommandChannel } from "./mamCommandChannel";

/**
 * Service to handle the registrations.
 */
export class RegistrationManagementService implements IRegistrationManagementService {
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings: LoadBalancerSettings;

    /**
     * Should we create return channels for registrations.
     */
    private readonly _shouldCreateReturnChannel: (registration: IRegistration) => boolean;

    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Service to store registrations.
     */
    private readonly _registrationStorageService: IStorageService<IRegistration>;

    /**
     * All the registrations.
     */
    private _registrations?: IRegistration[];

    /**
     * Initialise a new instance of RegistrationService.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param shouldCreateReturnChannel The callback to determine when to create return mam channel.
     */
    constructor(
        loadBalancerSettings: LoadBalancerSettings,
        shouldCreateReturnChannel: (registration: IRegistration) => boolean) {
        this._loadBalancerSettings = loadBalancerSettings;
        this._shouldCreateReturnChannel = shouldCreateReturnChannel;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
        this._registrationStorageService = ServiceFactory.get<IStorageService<IRegistration>>("registration-storage");
    }

    /**
     * Add a new registration.
     * @param registration The registration details.
     * @param root The client mam channel root.
     * @param sideKey The client mam channel side key.
     */
    public async addRegistration(registration: IRegistration, root: string, sideKey: string): Promise<void> {
        this._loggingService.log("registration", "add", registration, root, sideKey);
        const existingRegistration = await this._registrationStorageService.get(registration.id);

        if (existingRegistration) {
            this._loggingService.log("registration", "exists", existingRegistration);
            registration.itemName = registration.itemName || existingRegistration.itemName;
            registration.itemType = registration.itemType || existingRegistration.itemType;
            registration.itemMamChannel = existingRegistration.itemMamChannel;
            registration.returnMamChannel = existingRegistration.returnMamChannel;
        }

        await this.openMamChannels(root, sideKey, registration);

        this._loggingService.log("registration", "open", registration);

        await this._registrationStorageService.set(registration.id, registration);

        // Add it to the internal list if it doesn't exist
        const idx = this._registrations.findIndex(r => r.id === registration.id);
        if (idx < 0) {
            this._registrations.push(registration);
        } else {
            // Or update it if it does
            this._registrations[idx] = registration;
        }
    }

    /**
     * Remove a registration from the service.
     * @param registration The registration details.
     */
    public async removeRegistration(registrationId: string): Promise<void> {
        const registration = await this._registrationStorageService.get(registrationId);

        if (!registration) {
            throw new Error(`Registration '${registrationId}' does not exist.`);
        }

        // Remove if from the internal list if it exists
        const idx = this._registrations.findIndex(r => r.id === registration.id);
        if (idx >= 0) {
            this._registrations.splice(idx, 1);
        }

        await this._registrationStorageService.remove(registrationId);

        await this.closeMamChannels(registration);
    }

    /**
     * Load the registrations to initialise the queues.
     */
    public async loadRegistrations(): Promise<void> {
        this._loggingService.log("registration", `Loading registrations`);
        this._registrations = [];
        let page = 0;
        const pageSize = 20;
        let response;
        do {
            response = await this._registrationStorageService.page(undefined, page, pageSize);

            if (response && response.items && response.items.length > 0) {
                this._registrations = this._registrations.concat(response.items);
                page++;
            }
        } while (response && response.items && response.items.length > 0);

        this._loggingService.log("registration", `Loaded ${this._registrations.length} registrations`);
    }

    /**
     * Look for new command for each registration.
     * @param handleCommands Handle any new commands found from the registration.
     */
    public async pollCommands(
        handleCommands: (
            registration: IRegistration,
            commands: IMamCommand[],
            returnCommands: IMamCommand[]) => Promise<void>): Promise<void> {

        for (let i = 0; i < this._registrations.length; i++) {
            await this.getNewCommands(this._registrations[i], handleCommands);
        }
    }

    /**
     * Build the mam channels for the registration.
     * @param itemRoot The root passed from the client.
     * @param itemSideKey The side key passed from the client.
     * @param registration The registration object to build.
     */
    private async openMamChannels(itemRoot: string, itemSideKey: string, registration: IRegistration): Promise<void> {
        // We only build mam channels if the registering entity has sent details
        if (itemRoot && itemSideKey) {
            const currentItemRoot = registration.itemMamChannel && registration.itemMamChannel.initialRoot;
            const currentItemSideKey = registration.itemMamChannel && registration.itemMamChannel.sideKey;

            // Only setup again if its different to current.
            if (currentItemRoot !== itemRoot || currentItemSideKey !== itemSideKey) {
                this._loggingService.log("registration", `Initialising item channel`);

                const itemMamChannelConfiguration: IMamChannelConfiguration = {
                    initialRoot: itemRoot,
                    sideKey: itemSideKey
                };

                const itemMamChannel = new MamCommandChannel(this._loadBalancerSettings);
                const openSuccess = await itemMamChannel.openReadable(itemMamChannelConfiguration);

                if (!openSuccess) {
                    throw new Error(
                        "Unable to initialise mam channel for item, could not find initial 'hello' command."
                    );
                }

                registration.itemMamChannel = itemMamChannelConfiguration;
                this._loggingService.log("registration", `Initialising item channel complete`);
            }
        }

        if (registration.returnMamChannel === undefined && this._shouldCreateReturnChannel(registration)) {
            this._loggingService.log("registration", `Generating return channel hello`);

            const returnMamChannel = new MamCommandChannel(this._loadBalancerSettings);

            registration.returnMamChannel = {};
            await returnMamChannel.openWritable(registration.returnMamChannel);

            this._loggingService.log("registration", `Generating return channel hello complete`);
        }
    }

    /**
     * Close the mam channels that are open.
     * @param registration The registration to close the channels for.
     */
    private async closeMamChannels(registration: IRegistration): Promise<void> {
        if (registration.returnMamChannel) {
            const gridMamChannel = new MamCommandChannel(this._loadBalancerSettings);
            await gridMamChannel.closeWritable(registration.returnMamChannel);
            registration.returnMamChannel = undefined;
        }
    }

    /**
     * Get the new command for a registration.
     * @param registration The registration to update.
     * @param handleCommands Handle any new commands found from the registration.
     */
    private async getNewCommands(
        registration: IRegistration,
        handleCommands: (
            registration: IRegistration,
            commands: IMamCommand[],
            returnCommands: IMamCommand[]) => Promise<void>):
        Promise<void> {

        let updated = false;
        let commands = [];
        let returnCommands = [];

        if (registration.itemMamChannel) {
            const mamChannel = new MamCommandChannel(this._loadBalancerSettings);

            commands = await mamChannel.receiveCommands(registration.itemMamChannel);

            if (commands && commands.length > 0) {
                // Has the channel been reset by one of the commands
                if (registration.itemMamChannel.initialRoot && registration.itemMamChannel.sideKey === undefined) {
                    registration.itemMamChannel = undefined;
                }

                updated = true;
            }
        }

        if (registration.returnMamChannel) {
            const mamChannel = new MamCommandChannel(this._loadBalancerSettings);

            returnCommands = await mamChannel.receiveCommands(registration.returnMamChannel);

            if (returnCommands && returnCommands.length > 0) {
                // Has the channel been reset by one of the commands
                if (registration.returnMamChannel.initialRoot && registration.returnMamChannel.sideKey === undefined) {
                    registration.returnMamChannel = undefined;
                }

                updated = true;
            }
        }

        if (updated) {
            // If we retrieved new commands make sure we save the state
            // for the updated mam channel, this will also save the reset details
            // If we are going to update the state
            await this._registrationStorageService.set(registration.id, registration);
        }

        if (commands.length > 0 || returnCommands.length > 0) {
            await handleCommands(registration, commands, returnCommands);
        }
    }
}
