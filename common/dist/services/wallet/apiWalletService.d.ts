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
     * Create a new instance of ApiPaymentService
     * @param apiEndpoint The api configuration.
     */
    constructor(apiEndpoint: string);
    /**
     * Get the wallet details.
     * @param id The wallet id.
     * @returns The wallet.
     */
    getWallet(id: string): Promise<IWallet>;
    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toId The wallet id the payment is to.
     * @param amount The amount of the payment.
     */
    transfer(id: string, toId: string, amount: number): Promise<void>;
}
