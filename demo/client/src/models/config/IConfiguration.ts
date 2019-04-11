import { INodeConfiguration } from "p2p-energy-common/dist/models/config/INodeConfiguration";

export interface IConfiguration {
    /**
     * The provider to use for IOTA communication.
     */
    node: INodeConfiguration;

    /**
     * The endpoint for the demo api.
     */
    apiEndpoint: string;

    /**
     * The google analytics id.
     */
    googleAnalyticsId: string;

    /**
     * Url to use for mam exploration.
     */
    mamExplorer: string;
}
