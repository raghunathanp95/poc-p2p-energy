import * as aws from "aws-sdk";
import { IAWSDynamoDbConfiguration } from "../models/config/IAWSDynamoDbConfiguration";
/**
 * Class to helper with database.
 */
export declare class AmazonDynamoDbHelper {
    /**
     * Create and set the configuration for db.
     * @param config The configuration to use for connection.
     */
    static createAndSetConfig(config: IAWSDynamoDbConfiguration): void;
    /**
     * Create a new DB connection.
     * @param config The configuration for the connection.
     */
    static createConnection(config: IAWSDynamoDbConfiguration): aws.DynamoDB;
    /**
     * Create a doc client connection.
     * @param config The configuration to use for connection.
     */
    static createDocClient(config: IAWSDynamoDbConfiguration): aws.DynamoDB.DocumentClient;
}
