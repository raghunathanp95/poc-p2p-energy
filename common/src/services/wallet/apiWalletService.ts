import { IWallet } from "../../models/api/wallet/IWallet";
import { IWalletService } from "../../models/services/IWalletService";
import { WalletApiClient } from "../api/walletApiClient";

/**
 * Service to handle payment using the wallet api.
 */
export class ApiWalletService implements IWalletService {
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
     * Get the wallet details.
     * @param id The wallet id.
     * @returns The wallet.
     */
    public async getWallet(id: string): Promise<IWallet> {
        const paymentApiClient = new WalletApiClient(this._apiEndpoint);
        return paymentApiClient.getWallet({ id }).then(response => response.wallet);
    }

    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toId The wallet id the payment is to.
     * @param amount The amount of the payment.
     */
    public async transfer(
        id: string,
        toId: string,
        amount: number): Promise<void> {
        const paymentApiClient = new WalletApiClient(this._apiEndpoint);
        return paymentApiClient.transfer({ id, toId, amount })
            .then(response => undefined);
    }
}
