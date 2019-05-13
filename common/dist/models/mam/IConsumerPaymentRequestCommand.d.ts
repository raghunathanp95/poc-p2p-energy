import { IMamCommand } from "./IMamCommand";
export interface IConsumerPaymentRequestCommand extends IMamCommand {
    /**
     * The amount in IOTA requested from the consumer.
     */
    owed: number;
    /**
     * The usage amount that the request is for.
     */
    usage: number;
    /**
     * The address to send the payment to.
     */
    paymentAddress: string;
}
