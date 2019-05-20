import { IWallet } from "../api/wallet/IWallet";
/**
 * A service to handle payments between entities.
 */
export interface IWalletService {
    /**
     * Get the wallet details.
     * @param id The id of the wallet.
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
