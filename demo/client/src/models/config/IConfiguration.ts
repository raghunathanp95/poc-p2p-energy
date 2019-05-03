import { INodeConfiguration } from "p2p-energy-common/dist/models/config/INodeConfiguration";

export interface IConfiguration {
    /**
     * The nodes to use for IOTA communication.
     */
    nodes: INodeConfiguration[];

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
