export interface IPaymentTransferRequest {
    /**
     * The registration id of the item making the payment.
     */
    registrationId: string;
    /**
     * The registration id of the item receiving the payment.
     */
    toRegistrationId: string;
    /**
     * The address we are sending the payment to.
     */
    address: string;
    /**
     * The amount for the payment.
     */
    amount: number;
}
