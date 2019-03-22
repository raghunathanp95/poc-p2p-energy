import { INodeConfiguration } from "poc-p2p-energy-grid-common";
import { IConsumerConfiguration } from "./IConsumerConfiguration";

/**
 * Definition of configuration file.
 */
export interface IConfiguration {
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
     * Config for the consumer.
     */
    consumer: IConsumerConfiguration;
}
