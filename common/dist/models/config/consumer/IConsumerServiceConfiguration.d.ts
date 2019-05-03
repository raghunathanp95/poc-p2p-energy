import { INodeConfiguration } from "../INodeConfiguration";
import { IConsumerConfiguration } from "./IConsumerConfiguration";
/**
 * Definition of configuration file.
 */
export interface IConsumerServiceConfiguration {
    /**
     * The nodes to use for IOTA communication.
     */
    nodes: INodeConfiguration[];
    /**
     * Local storage location.
     */
    localStorageFolder?: string;
    /**
     * The endpoint where the grid api lives.
     */
    gridApiEndpoint: string;
    /**
     * Config for the consumer.
     */
    consumer: IConsumerConfiguration;
}
