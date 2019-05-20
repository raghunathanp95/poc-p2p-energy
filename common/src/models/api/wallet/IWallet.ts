export interface IWallet {
    /**
     * The current balance of the wallet.
     */
    balance: number;
    /**
     * The last incoming payment bundle.
     */
    incomingBundleHash?: string;
    /**
     * The last outgoing payment bundle.
     */
    outgoingBundleHash?: string;
}
