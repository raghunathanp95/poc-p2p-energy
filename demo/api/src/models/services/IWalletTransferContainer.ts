import { IWalletTransfer } from "./IWalletTransfer";

export interface IWalletTransferContainer {
    /**
     * The pending transfer.
     */
    pending?: IWalletTransfer;

    /**
     * Queued tranfer.
     */
    queue: IWalletTransfer[];
}
