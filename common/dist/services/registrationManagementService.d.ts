import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IRegistrationManagementService } from "../models/services/IRegistrationManagementService";
import { IRegistration } from "../models/services/registration/IRegistration";
/**
 * Service to handle the registrations.
 */
export declare class RegistrationManagementService implements IRegistrationManagementService {
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
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
     * All the registrations.
     */
    private _registrations?;
    /**
     * Initialise a new instance of RegistrationService.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param shouldCreateReturnChannel The callback to determine when to create return mam channel.
     */
    constructor(loadBalancerSettings: LoadBalancerSettings, shouldCreateReturnChannel: (registration: IRegistration) => boolean);
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
     * @param sideKey The client mam channel side key used for remove validation.
     */
    removeRegistration(registrationId: string, sideKey: string): Promise<void>;
    /**
     * Load the registrations to initialise the queues.
     */
    loadRegistrations(): Promise<void>;
    /**
     * Look for new command for each registration.
     * @param handleCommands Handle any new commands found from the registration.
     */
    pollCommands(handleCommands: (registration: IRegistration, commands: IMamCommand[]) => Promise<void>): Promise<void>;
    /**
     * Send commands to the return channel.
     * @param commands The commands to return to the registrations.
     */
    returnCommands(commands: {
        [registrationId: string]: IMamCommand[];
    }): Promise<void>;
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
     * @param handleCommands Handle any new commands found from the registration.
     */
    private getNewCommands;
}
