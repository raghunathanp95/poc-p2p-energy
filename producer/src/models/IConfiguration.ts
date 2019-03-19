import { INodeConfiguration } from "poc-p2p-energy-grid-common";
import { IProducerConfiguration } from "./IProducerConfiguration";

/**
 * Definition of configuration file.
 */
export interface IConfiguration {
    /**
     * The provider to use for IOTA communication.
     */
    node: INodeConfiguration;

    /**
     * The endpoint where the grid api lives.
     */
    gridApiEndpoint: string;

    /**
     * Config for the producer.
     */
    producer: IProducerConfiguration;
}
