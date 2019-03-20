import { IAWSDynamoDbConfiguration, IAWSS3Configuration, INodeConfiguration } from "poc-p2p-energy-grid-common";
import { IGridConfiguration } from "./IGridConfiguration";

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
     * The dynamic db connection.
     */
    dynamoDbConnection?: IAWSDynamoDbConfiguration;

    /**
     * S3 storage connection.
     */
    s3Connection?: IAWSS3Configuration;

    /**
     * Config for the grid.
     */
    grid: IGridConfiguration;
}
