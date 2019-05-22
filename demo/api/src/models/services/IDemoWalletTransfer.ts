
import { IDemoWalletTransferPayload } from "./IDemoWalletTransferPayload";

export interface IDemoWalletTransfer {
    /**
     * The source wallet for the transfer.
     */
    sourceWalletId: string;
    /**
     * The receiver of the transfer.
     */
    receiveWalletId: string;
    /**
     * The transfer address.
     */
    address?: string;
    /**
     * The transfer tag.
     */
    tag?: string;
    /**
     * The amount.
     */
    value?: number;
    /**
     * The message.
     */
    payload?: IDemoWalletTransferPayload;
    /**
     * The bundle hash.
     */
    bundle?: string;
    /**
     * The time the bundle was confirmed.
     */
    confirmed?: number;
}
