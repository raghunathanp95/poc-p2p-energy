import * as aws from "aws-sdk";
import { IAWSDynamoDbConfiguration } from "../models/config/IAWSDynamoDbConfiguration";

/**
 * Class to helper with database.
 */
export class AmazonDynamoDbHelper {
    /**
     * Create and set the configuration for db.
     * @param config The configuration to use for connection.
     */
    public static createAndSetConfig(config: IAWSDynamoDbConfiguration): void {
        const awsConfig = new aws.Config({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region
        });

        aws.config.update(awsConfig);
    }

    /**
     * Create a new DB connection.
     * @param config The configuration for the connection.
     */
    public static createConnection(config: IAWSDynamoDbConfiguration): aws.DynamoDB {
        AmazonDynamoDbHelper.createAndSetConfig(config);

        return new aws.DynamoDB({ apiVersion: "2012-10-08" });
    }

    /**
     * Create a doc client connection.
     * @param config The configuration to use for connection.
     */
    public static createDocClient(config: IAWSDynamoDbConfiguration): aws.DynamoDB.DocumentClient {
        AmazonDynamoDbHelper.createAndSetConfig(config);

        return new aws.DynamoDB.DocumentClient({
            apiVersion: "2012-10-08",
            convertEmptyValues: true
        });
    }
}
