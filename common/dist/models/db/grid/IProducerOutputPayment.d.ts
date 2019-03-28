import { IProducerOutputEntry } from "./IProducerOutputEntry";
/**
 * Object definition for storing output from a producer.
 */
export interface IProducerOutputPayment extends IProducerOutputEntry {
    /**
     * The payment bundles for the payment.
     */
    paymentBundles: string[];
}
