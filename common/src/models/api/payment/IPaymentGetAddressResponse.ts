import { IResponse } from "../IResponse";

// tslint:disable-next-line:no-empty-interface
export interface IPaymentGetAddressResponse extends IResponse {
    /**
     * The generated address.
     */
    address?: string;
}
