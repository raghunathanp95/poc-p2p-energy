import { Transaction } from "@iota/core/typings/types";

export interface IWalletState {
    /**
     * The seed of the wallet.
     */
    seed: string;

    /**
     * The balance of the wallet.
     */
    balance: number;

    /**
     * The last used index.
     */
    lastIndex: number;

    /**
     * The pending transaction objects.
     */
    pendingTransaction: string;

    /**
     * The pending transaction objects.
     */
    pendingTransfers: ReadonlyArray<Transaction>[];
}
