import { IProducerStoreOutput } from "./IProducerStoreOutput";

/**
 * Object definition for storing output from a producer.
 */
export interface IProducerStore {
    /**
     * The id of the producers.
     */
    id: string;

    /**
     * The output records from the producer.
     */
    output: IProducerStoreOutput[];
}
