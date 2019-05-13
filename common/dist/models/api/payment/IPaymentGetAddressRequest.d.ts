export interface IPaymentGetAddressRequest {
    /**
     * The registration id of the item.
     */
    registrationId: string;
    /**
     * The address index to generate.
     */
    addressIndex: number;
}
