export interface IWalletTransfer {
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
     * The amount.
     */
    value?: number;
    /**
     * The message.
     */
    message?: string;
    /**
     * The tag.
     */
    tag?: string;
    /**
     * The bundle hash.
     */
    bundle?: string;
}
