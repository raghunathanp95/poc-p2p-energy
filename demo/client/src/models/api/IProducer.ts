import { ISource } from "./ISource";

export interface IProducer {
    /**
     * The id of the producer.
     */
    id: string;

    /**
     * The name of the producer.
     */
    name: string;

    /**
     * The list of sources.
     */
    sources: ISource[];
}
