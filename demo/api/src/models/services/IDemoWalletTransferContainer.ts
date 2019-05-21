import { IDemoWalletTransfer } from "./IDemoWalletTransfer";

export interface IDemoWalletTransferContainer {
    /**
     * The pending transfer.
     */
    pending?: IDemoWalletTransfer;

    /**
     * Queued tranfer.
     */
    queue: IDemoWalletTransfer[];
}
