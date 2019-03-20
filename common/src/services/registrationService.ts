import { ServiceFactory } from "../factories/serviceFactory";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IMamChannelConfiguration } from "../models/mam/IMamChannelConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { IRegistrationService } from "../models/services/IRegistrationService";
import { IStorageService } from "../models/services/IStorageService";
import { IRegistration } from "../models/services/registration/IRegistration";
import { MamCommandChannel } from "./mamCommandChannel";

/**
 * Service to handle the registrations.
 */
export class RegistrationService implements IRegistrationService {
    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfiguration: INodeConfiguration;

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
     * All the possible registrations.
     */
    private _allRegistrations?: IRegistration[];

    /**
     * The registration left to process in current queue.
     */
    private _registrationsQueue?: IRegistration[];

    /**
     * Initialise a new instance of RegistrationService.
     * @param nodeConfiguration The configuration.
     * @param shouldCreateReturnChannel The callback to determine when to create return mam channel.
     */
    constructor(
        nodeConfiguration: INodeConfiguration,
        shouldCreateReturnChannel: (registration: IRegistration) => boolean) {
        this._nodeConfiguration = nodeConfiguration;
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

        this.addQueueRegistration(registration);
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

        this.removeQueueRegistration(registrationId);

        await this._registrationStorageService.remove(registrationId);

        await this.closeMamChannels(registration);
    }

    /**
     * Load the registrations to intialise the queues.
     */
    public async loadRegistrations(): Promise<void> {
        this._loggingService.log("registration", `Loading registrations`);
        this._allRegistrations = [];
        let page = 0;
        const pageSize = 20;
        let response;
        do {
            response = await this._registrationStorageService.page(undefined, page, pageSize);

            if (response && response.items && response.items.length > 0) {
                this._allRegistrations = this._allRegistrations.concat(response.items);
                page++;
            }
        } while (response && response.items && response.items.length > 0);

        this._registrationsQueue = [];
        this._loggingService.log("registration", `Loaded ${this._allRegistrations.length} registrations`);
    }

    /**
     * Look for new command for each registration.
     * @param handleCommands Handle any new commands found from the registration.
     */
    public async pollCommands(
        handleCommands: (registration: IRegistration, commands: IMamCommand[]) => Promise<void>): Promise<void> {
        if (this._allRegistrations.length > 0) {
            if (this._registrationsQueue.length === 0) {
                this._registrationsQueue = this._allRegistrations.slice(0);
            }

            if (this._registrationsQueue.length > 0) {
                const nextRegistration = this._registrationsQueue.shift();
                await this.getNewCommands(nextRegistration, handleCommands);
            }
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

                const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);
                const openSuccess = await itemMamChannel.openReadable(itemMamChannelConfiguration);

                if (!openSuccess) {
                    throw new Error(
                        "Unable to intialise mam channel for item, could not find initial 'hello' command."
                    );
                }

                registration.itemMamChannel = itemMamChannelConfiguration;
                this._loggingService.log("registration", `Initialising item channel complete`);
            }

            if (registration.returnMamChannel === undefined && this._shouldCreateReturnChannel(registration)) {
                this._loggingService.log("registration", `Generating return channel hello`);

                const returnMamChannel = new MamCommandChannel(this._nodeConfiguration);

                registration.returnMamChannel = {};
                await returnMamChannel.openWritable(registration.returnMamChannel);

                this._loggingService.log("registration", `Generating return channel hello complete`);
            }
        }
    }

    /**
     * Close the mam channels that are open.
     * @param registration The registration to close the channels for.
     */
    private async closeMamChannels(registration: IRegistration): Promise<void> {
        if (registration.returnMamChannel) {
            const gridMamChannel = new MamCommandChannel(this._nodeConfiguration);
            await gridMamChannel.closeWritable(registration.returnMamChannel);
            registration.returnMamChannel = undefined;
        }
    }

    /**
     * Get the new command for a registration.
     * @param registration The registration to update.
     * @returns Log of process.
     */
    private async getNewCommands(
        registration: IRegistration,
        handleCommands: (registration: IRegistration, commands: IMamCommand[]) => Promise<void>): Promise<void> {
        if (registration.itemMamChannel) {
            const mamChannel = new MamCommandChannel(this._nodeConfiguration);

            const commands = await mamChannel.receiveCommands(registration.itemMamChannel);

            if (commands && commands.length > 0) {
                // Has the channel been reset by one of the commands
                if (registration.itemMamChannel.initialRoot && registration.itemMamChannel.sideKey === undefined) {
                    registration.itemMamChannel = undefined;
                }

                // If we retrieved new commands make sure we save the state
                // for the updated mam channel, this will also save the reset details
                await this._registrationStorageService.set(registration.id, registration);

                await handleCommands(registration, commands);
            }
        }
    }

    /**
     * Add a registration to the queues.
     * @param registration The registrations to add.
     */
    private addQueueRegistration(registration: IRegistration): void {
        this.removeQueueRegistration(registration.id);

        // We need to add the new item into work queue if it doesn't already exist
        // as we only read the registrations form the db on startup
        this._allRegistrations = this._allRegistrations || [];
        this._registrationsQueue = this._registrationsQueue || [];
        this._allRegistrations.push(registration);
        this._registrationsQueue.push(registration);
    }

    /**
     * Remove registration from the queues if they exist.
     * @param registrationId The registration to remove.
     */
    private removeQueueRegistration(registrationId: string): void {
        if (this._allRegistrations) {
            const idx = this._allRegistrations.findIndex(r => r.id === registrationId);
            if (idx >= 0) {
                this._allRegistrations.splice(idx, 1);
            }
        }

        if (this._registrationsQueue) {
            const idx2 = this._registrationsQueue.findIndex(r => r.id === registrationId);
            if (idx2 >= 0) {
                this._registrationsQueue.splice(idx2, 1);
            }
        }
    }
}
