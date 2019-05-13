import { IResponse } from "../IResponse";

// tslint:disable-next-line:no-empty-interface
export interface IPaymentTransferResponse extends IResponse {
    /**
     * The bundle hash of the payment.
     */
    bundle?: string;
}
