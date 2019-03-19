import { IAWSDynamoDbConfiguration, IAWSS3Configuration, INodeConfiguration } from "poc-p2p-energy-grid-common";

/**
 * Definition of configuration file.
 */
export interface IConfiguration {
    /**
     * The provider to use for IOTA communication.
     */
    node: INodeConfiguration;

    /**
     * The dynamic db connection.
     */
    dynamoDbConnection: IAWSDynamoDbConfiguration;

    /**
     * S3 storage connection.
     */
    s3Connection: IAWSS3Configuration;

    /**
     * Storage bucket.
     */
    storageBucket: string;
}
