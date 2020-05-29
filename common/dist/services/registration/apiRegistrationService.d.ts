import { IRegistrationService } from "../../models/services/IRegistrationService";
/**
 * Service to handle the storage using the storage api.
 */
export declare class ApiRegistrationService implements IRegistrationService {
    /**
     * The storage api endpoint.
     */
    private readonly _apiEndpoint;
    /**
     * Create a new instance of ApiRegistrationService
     * @param apiEndpoint The api configuration.
     */
    constructor(apiEndpoint: string);
    /**
     * Create a new registration.
     * @param registrationId The registration id of the item.
     * @param itemName Name of the item.
     * @param itemType The type of the item.
     * @param root The initial root for the mam channel.
     * @param sideKey The private key for the mam channel.
     * @returns The response from the request.
     */
    register(registrationId: string, itemName?: string, itemType?: string, root?: string, sideKey?: string): Promise<{
        /**
         * The root used for the channel from the registration.
         */
        root?: string;
        /**
         * The private key used for decoding the channel.
         */
        sideKey?: string;
    }>;
    /**
     * Remove a registration.
     * @param registrationId The registration id of the item.
     * @param sideKey The client mam channel side key used for remove validation.
     */
    unregister(registrationId: string, sideKey: string): Promise<void>;
}
