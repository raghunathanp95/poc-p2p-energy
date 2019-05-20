import { IWalletGetRequest } from "../../models/api/wallet/IWalletGetRequest";
import { IWalletGetResponse } from "../../models/api/wallet/IWalletGetResponse";
import { IWalletTransferRequest } from "../../models/api/wallet/IWalletTransferRequest";
import { IWalletTransferResponse } from "../../models/api/wallet/IWalletTransferResponse";
/**
 * Class to handle storage api communications.
 */
export declare class WalletApiClient {
    /**
     * The endpoint for performing communications.
     */
    private readonly _endpoint;
    /**
     * Create a new instance of WalletApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint: string);
    /**
     * Get the wallet details.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    getWallet(request: IWalletGetRequest): Promise<IWalletGetResponse>;
    /**
     * Make a payment between registrations.
     * @param request The request to send.
     * @returns The response from the request.
     */
    transfer(request: IWalletTransferRequest): Promise<IWalletTransferResponse>;
}
