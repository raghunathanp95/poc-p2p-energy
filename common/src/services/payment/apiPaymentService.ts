import { IPaymentService } from "../../models/services/IPaymentService";
import { PaymentApiClient } from "../api/paymentApiClient";

/**
 * Service to handle payment using the payment api.
 */
export class ApiPaymentService implements IPaymentService {
    /**
     * The storage api endpoint.
     */
    private readonly _apiEndpoint: string;

    /**
     * Create a new instance of ApiPaymentService
     * @param apiEndpoint The api configuration.
     */
    constructor(apiEndpoint: string) {
        this._apiEndpoint = apiEndpoint;
    }

    /**
     * Register with the payment service.
     * @param registrationId The registration id.
     * @returns True if registration was successful.
     */
    public async register(registrationId: string): Promise<boolean> {
        const paymentApiClient = new PaymentApiClient(this._apiEndpoint);
        return paymentApiClient.register({ registrationId }).then(response => response.success);
    }

    /**
     * Generate an address for the registration.
     * @param registrationId The registration id.
     * @param addressIndex The address index.
     * @returns The generated address.
     */
    public async getAddress(registrationId: string, addressIndex: number): Promise<string> {
        const paymentApiClient = new PaymentApiClient(this._apiEndpoint);
        return paymentApiClient.getAddress({ registrationId, addressIndex }).then(response => response.address);
    }

    /**
     * Make a payment from a registration.
     * @param registrationId The registration the payment is from.
     * @param toRegistrationId The registration the payment is to.
     * @param address The address we are making the payment to.
     * @param amount The amount of the payment.
     * @returns The bundle hash for the payment.
     */
    public async transfer(
        registrationId: string,
        toRegistrationId: string,
        address: string,
        amount: number): Promise<string> {
        const paymentApiClient = new PaymentApiClient(this._apiEndpoint);
        return paymentApiClient.transfer({ registrationId, toRegistrationId, address: address, amount })
            .then(response => response.bundle);
    }
}
