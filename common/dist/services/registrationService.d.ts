import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IRegistrationService } from "../models/services/IRegistrationService";
import { IRegistration } from "../models/services/registration/IRegistration";
/**
 * Service to handle the registrations.
 */
export declare class RegistrationService implements IRegistrationService {
    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfig;
    /**
     * Should we create return channels for registrations.
     */
    private readonly _shouldCreateReturnChannel;
    /**
     * Service to log output to.
     */
    private readonly _loggingService;
    /**
     * Service to store registrations.
     */
    private readonly _registrationStorageService;
    /**
     * All the possible registrations.
     */
    private _allRegistrations?;
    /**
     * The registration left to process in current queue.
     */
    private _registrationsQueue?;
    /**
     * Initialise a new instance of RegistrationService.
     * @param nodeConfig The configuration.
     * @param shouldCreateReturnChannel The callback to determine when to create return mam channel.
     */
    constructor(nodeConfig: INodeConfiguration, shouldCreateReturnChannel: (registration: IRegistration) => boolean);
    /**
     * Add a new registration.
     * @param registration The registration details.
     * @param root The client mam channel root.
     * @param sideKey The client mam channel side key.
     */
    addRegistration(registration: IRegistration, root: string, sideKey: string): Promise<void>;
    /**
     * Remove a registration from the service.
     * @param registration The registration details.
     */
    removeRegistration(registrationId: string): Promise<void>;
    /**
     * Load the registrations to intialise the queues.
     */
    loadRegistrations(): Promise<void>;
    /**
     * Look for new command for each registration.
     * @param handleCommands Handle any new commands found from the registration.
     */
    pollCommands(handleCommands: (registration: IRegistration, commands: IMamCommand[]) => Promise<void>): Promise<void>;
    /**
     * Build the mam channels for the registration.
     * @param itemRoot The root passed from the client.
     * @param itemSideKey The side key passed from the client.
     * @param registration The registration object to build.
     */
    private openMamChannels;
    /**
     * Close the mam channels that are open.
     * @param registration The registration to close the channels for.
     */
    private closeMamChannels;
    /**
     * Get the new command for a registration.
     * @param registration The registration to update.
     * @returns Log of process.
     */
    private getNewCommands;
    /**
     * Add a registration to the queues.
     * @param registration The registrations to add.
     */
    private addQueueRegistration;
    /**
     * Remove registration from the queues if they exist.
     * @param registrationId The registration to remove.
     */
    private removeQueueRegistration;
}
