import { INodeConfiguration } from "../INodeConfiguration";
import { ISourceConfiguration } from "./ISourceConfiguration";
/**
 * Definition of configuration file.
 */
export interface ISourceServiceConfiguration {
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
