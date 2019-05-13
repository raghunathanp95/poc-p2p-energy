import { IResponse } from "../IResponse";
export interface IPaymentGetAddressResponse extends IResponse {
    /**
     * The generated address.
     */
    address?: string;
}
