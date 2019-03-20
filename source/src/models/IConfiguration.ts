import { INodeConfiguration } from "poc-p2p-energy-grid-common";
import { ISourceConfiguration as ISourceConfiguration } from "./ISourceConfiguration";

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
     * The endpoint where the producer api lives.
     */
    producerApiEndpoint: string;

    /**
     * Config for the source.
     */
    source: ISourceConfiguration;
}
