import { IProducerOutputPayment } from "./IProducerOutputPayment";

/**
 * Object definition for storing output from a producer.
 */
export interface IProducerPaidStore {
    /**
     * The id of the producers.
     */
    id: string;

    /**
     * The output records from the producer.
     */
    output: IProducerOutputPayment[];
}
