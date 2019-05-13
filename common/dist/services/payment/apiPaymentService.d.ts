import { IPaymentService } from "../../models/services/IPaymentService";
/**
 * Service to handle payment using the payment api.
 */
export declare class ApiPaymentService implements IPaymentService {
    /**
     * The storage api endpoint.
     */
    private readonly _apiEndpoint;
    /**
     * Create a new instance of ApiPaymentService
     * @param apiEndpoint The api configuration.
     */
    constructor(apiEndpoint: string);
    /**
     * Register with the payment service.
     * @param registrationId The registration id.
     * @returns True if registration was successful.
     */
    register(registrationId: string): Promise<boolean>;
    /**
     * Generate an address for the registration.
     * @param registrationId The registration id.
     * @param addressIndex The address index.
     * @returns The generated address.
     */
    getAddress(registrationId: string, addressIndex: number): Promise<string>;
    /**
     * Make a payment from a registration.
     * @param registrationId The registration the payment is from.
     * @param toRegistrationId The registration the payment is to.
     * @param address The address we are making the payment to.
     * @param amount The amount of the payment.
     * @returns The bundle hash for the payment.
     */
    transfer(registrationId: string, toRegistrationId: string, address: string, amount: number): Promise<string>;
}
