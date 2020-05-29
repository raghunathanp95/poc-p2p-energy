import { IWallet } from "../../models/api/wallet/IWallet";
import { IWalletService } from "../../models/services/IWalletService";
/**
 * Service to handle payment using the wallet api.
 */
export declare class ApiWalletService implements IWalletService {
    /**
     * The storage api endpoint.
     */
    private readonly _apiEndpoint;
    /**
     * The unique id for the client sending the requests.
     */
    private readonly _clientId;
    /**
     * Create a new instance of ApiPaymentService
     * @param apiEndpoint The api configuration.
     * @param clientId The client id for the wallet.
     */
    constructor(apiEndpoint: string, clientId: string);
    /**
     * Get the wallet details.
     * @param id The wallet id.
     * @param incomingEpoch Only return incoming transfers after the epoch.
     * @param outgoingEpoch Only return outgoing transfers after the epoch.
     * @returns The wallet.
     */
    getWallet(id: string, incomingEpoch?: number, outgoingEpoch?: number): Promise<IWallet>;
    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toIdOrAddress The wallet id the payment is to.
     * @param amount The amount of the payment.
     * @returns Nothing.
     */
    transfer(id: string, toIdOrAddress: string, amount: number): Promise<void>;
}
