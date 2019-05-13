import { INodeConfiguration } from "p2p-energy-common/dist/models/config/INodeConfiguration";
import { ITangleExplorerConfiguration } from "./ITangleExplorerConfiguration";

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

    /**
     * Configuration for tangle explorer.
     */
    tangleExplorer: ITangleExplorerConfiguration;
}
