import { IAWSDynamoDbConfiguration } from "../IAWSDynamoDbConfiguration";
import { IAWSS3Configuration } from "../IAWSS3Configuration";
import { INodeConfiguration } from "../INodeConfiguration";
import { IGridConfiguration } from "./IGridConfiguration";
/**
 * Definition of configuration file.
 */
export interface IGridServiceConfiguration {
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
