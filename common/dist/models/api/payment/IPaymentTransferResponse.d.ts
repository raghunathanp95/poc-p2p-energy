import { IResponse } from "../IResponse";
export interface IPaymentTransferResponse extends IResponse {
    /**
     * The bundle hash of the payment.
     */
    bundle?: string;
}
