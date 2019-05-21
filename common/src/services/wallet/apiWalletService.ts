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
     * @param incomingEpoch Only return incoming transfers after the epoch.
     * @param outgoingEpoch Only return incoming transfers after the epoch.
     * @returns The wallet.
     */
    public async getWallet(id: string, incomingEpoch?: number, outgoingEpoch?: number): Promise<IWallet> {
        const paymentApiClient = new WalletApiClient(this._apiEndpoint);
        return paymentApiClient.getWallet({ id, incomingEpoch, outgoingEpoch }).then(response => response);
    }

    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toIdOrAddress The wallet id the payment is to.
     * @param amount The amount of the payment.
     */
    public async transfer(
        id: string,
        toIdOrAddress: string,
        amount: number): Promise<void> {
        const paymentApiClient = new WalletApiClient(this._apiEndpoint);
        return paymentApiClient.transfer({ id, toIdOrAddress, amount })
            .then(response => undefined);
    }
}
