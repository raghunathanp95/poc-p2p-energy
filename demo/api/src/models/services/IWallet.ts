import { IWalletTransfer } from "./IWalletTransfer";

export interface IWallet {
    /**
     * The id of the wallet.
     */
    id: string;

    /**
     * The seed of the wallet.
     */
    seed: string;

    /**
     * The balance of the wallet.
     */
    balance: number;

    /**
     * The start index to use for balance checks.
     */
    startIndex: number;

    /**
     * The last index we used to allocate an receive address.
     */
    lastIndex: number;

    /**
     * The bundle hash of the last outgoing transfer.
     */
    lastOutgoingTransfer?: IWalletTransfer;

    /**
     * The bundle hash of the last incoming transfer.
     */
    lastIncomingTransfer?: IWalletTransfer;
}
