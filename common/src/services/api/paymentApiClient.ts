import axios from "axios";
import { IResponse } from "../../models/api/IResponse";
import { IPaymentGetAddressRequest } from "../../models/api/payment/IPaymentGetAddressRequest";
import { IPaymentGetAddressResponse } from "../../models/api/payment/IPaymentGetAddressResponse";
import { IPaymentRegisterRequest } from "../../models/api/payment/IPaymentRegisterRequest";
import { IPaymentRegisterResponse } from "../../models/api/payment/IPaymentRegisterResponse";
import { IPaymentTransferRequest } from "../../models/api/payment/IPaymentTransferRequest";
import { IPaymentTransferResponse } from "../../models/api/payment/IPaymentTransferResponse";
import { ApiHelper } from "../../utils/apiHelper";

/**
 * Class to handle storage api communications.
 */
export class PaymentApiClient {
    /**
     * The endpoint for performing communications.
     */
    private readonly _endpoint: string;

    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint: string) {
        this._endpoint = endpoint;
    }

    /**
     * Register with the payment service.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async register(request: IPaymentRegisterRequest): Promise<IPaymentRegisterResponse> {
        const ax = axios.create({ baseURL: this._endpoint });
        let response: IResponse;

        try {
            const axiosResponse = await ax.post<IResponse>(
                `payment/register`,
                request
            );

            response = axiosResponse.data;
        } catch (err) {
            response = {
                success: false,
                message: `There was a problem communicating with the API.\n${err}`
            };
        }

        return response;
    }

    /**
     * Generate a new address.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    public async getAddress(request: IPaymentGetAddressRequest): Promise<IPaymentGetAddressResponse> {
        const ax = axios.create({ baseURL: this._endpoint });
        let response: IPaymentGetAddressResponse;

        try {
            const axiosResponse = await ax.post<IPaymentGetAddressResponse>(
                ApiHelper.joinParams(`payment`, [request.registrationId, "address"]),
                ApiHelper.removeKeys(request, ["registrationId"])
            );

            response = axiosResponse.data;
        } catch (err) {
            response = {
                success: false,
                message: `There was a problem communicating with the API.\n${err}`
            };
        }

        return response;
    }

    /**
     * Make a payment between registrations.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async transfer(request: IPaymentTransferRequest): Promise<IPaymentTransferResponse> {
        const ax = axios.create({ baseURL: this._endpoint });
        let response: IPaymentTransferResponse;

        try {
            const axiosResponse = await ax.post<IResponse>(
                ApiHelper.joinParams(`payment`, [request.registrationId, "transfer"]),
                ApiHelper.removeKeys(request, ["fromRegistrationId"])
            );

            response = axiosResponse.data;
        } catch (err) {
            response = {
                success: false,
                message: `There was a problem communicating with the API.\n${err}`
            };
        }

        return response;
    }
}
