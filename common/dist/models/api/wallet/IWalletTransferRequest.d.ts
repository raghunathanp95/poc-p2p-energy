export interface IWalletTransferRequest {
    /**
     * The id of the item making the payment.
     */
    id: string;
    /**
     * The id of the item receiving the payment.
     */
    toId: string;
    /**
     * The amount for the payment.
     */
    amount: number;
}
