import { INodeConfiguration } from "../INodeConfiguration";
import { IProducerConfiguration } from "./IProducerConfiguration";
/**
 * Definition of configuration file.
 */
export interface IProducerServiceConfiguration {
    /**
     * The provider to use for IOTA communication.
     */
    node: INodeConfiguration;
    /**
     * Local storage location.
     */
    localStorageFolder?: string;
    /**
     * The endpoint where the grid api lives.
     */
    gridApiEndpoint: string;
    /**
     * Config for the producer.
     */
    producer: IProducerConfiguration;
}
