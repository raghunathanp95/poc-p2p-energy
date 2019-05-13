export interface IPaymentRegistration {
    /**
     * The registration id of the item.
     */
    id: string;

    /**
     * The seed for the registration.
     */
    seed: string;

    /**
     * The time of last usage.
     */
    lastUsage: number;
}
