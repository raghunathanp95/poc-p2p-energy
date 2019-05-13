import { IPaymentGetAddressRequest } from "../../models/api/payment/IPaymentGetAddressRequest";
import { IPaymentGetAddressResponse } from "../../models/api/payment/IPaymentGetAddressResponse";
import { IPaymentRegisterRequest } from "../../models/api/payment/IPaymentRegisterRequest";
import { IPaymentRegisterResponse } from "../../models/api/payment/IPaymentRegisterResponse";
import { IPaymentTransferRequest } from "../../models/api/payment/IPaymentTransferRequest";
import { IPaymentTransferResponse } from "../../models/api/payment/IPaymentTransferResponse";
/**
 * Class to handle storage api communications.
 */
export declare class PaymentApiClient {
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
     * Register with the payment service.
     * @param request The request to send.
     * @returns The response from the request.
     */
    register(request: IPaymentRegisterRequest): Promise<IPaymentRegisterResponse>;
    /**
     * Generate a new address.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    getAddress(request: IPaymentGetAddressRequest): Promise<IPaymentGetAddressResponse>;
    /**
     * Make a payment between registrations.
     * @param request The request to send.
     * @returns The response from the request.
     */
    transfer(request: IPaymentTransferRequest): Promise<IPaymentTransferResponse>;
}
