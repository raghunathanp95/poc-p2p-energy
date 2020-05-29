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
     * @param incomingEpoch Only return incoming transfers after the epoch.
     * @param outgoingEpoch Only return outgoing transfers after the epoch.
     * @returns The wallet.
     */
    getWallet(id: string, incomingEpoch?: number, outgoingEpoch?: number): Promise<IWallet>;
    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toIdOrAddress The wallet id the payment is to or an address.
     * @param amount The amount of the payment.
     */
    transfer(id: string, toIdOrAddress: string, amount: number): Promise<void>;
}
