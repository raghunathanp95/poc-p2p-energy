import { IResponse } from "../../models/api/IResponse";
import { IRegistrationDeleteRequest } from "../../models/api/registration/IRegistrationDeleteRequest";
import { IRegistrationSetRequest } from "../../models/api/registration/IRegistrationSetRequest";
import { IRegistrationSetResponse } from "../../models/api/registration/IRegistrationSetResponse";
/**
 * Class to handle registration api communications.
 */
export declare class RegistrationApiClient {
    /**
     * The endpoint for performing communications.
     */
    private readonly _endpoint;
    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint: string);
    /**
     * Register with the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    registrationSet(request: IRegistrationSetRequest): Promise<IRegistrationSetResponse>;
    /**
     * Unregister from the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    registrationDelete(request: IRegistrationDeleteRequest): Promise<IResponse>;
}
