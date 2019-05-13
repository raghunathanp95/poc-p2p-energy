/**
 * A service to handle payments between entities.
 */
export interface IPaymentService {
    /**
     * Register with the payment service.
     * @param registrationId The registration id.
     * @returns True if registration was successful.
     */
    register(registrationId: string): Promise<boolean>;

    /**
     * Generate an address for the registration.
     * @param registrationId The registration id.
     * @param index The address index.
     * @returns The generated address.
     */
    getAddress(registrationId: string, index: number): Promise<string>;

    /**
     * Make a payment from a registration.
     * @param registrationId The registration the payment is from.
     * @param toRegistrationId The registration the payment is to.
     * @param paymentAddress The payment address.
     * @param amount The amount of the payment.
     * @returns The bundle hash for the payment.
     */
    transfer(
        registrationId: string,
        toRegistrationId: string,
        paymentAddress: string,
        amount: number): Promise<string>;
}
