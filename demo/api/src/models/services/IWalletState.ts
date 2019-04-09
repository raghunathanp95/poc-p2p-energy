export interface IWalletState {
    /**
     * The seed of the wallet.
     */
    seed: string;

    /**
     * The next index to use.
     */
    nextIndex: number;

    /**
     * The balance of the wallet.
     */
    balance: number;
}
