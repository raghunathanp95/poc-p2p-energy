import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { IWallet } from "../../models/api/wallet/IWallet";
import { IWalletService } from "../../models/services/IWalletService";
/**
 * Service to handle wallet.
 */
export declare class BasicWalletService implements IWalletService {
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
    /**
     * Wallet seed.
     */
    private readonly _walletSeed;
    /**
     * The config service.
     */
    private readonly _storageService;
    /**
     * Create a new instance of BasicWalletService
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param walletSeed The wallet seed.
     */
    constructor(loadBalancerSettings: LoadBalancerSettings, walletSeed: string);
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
