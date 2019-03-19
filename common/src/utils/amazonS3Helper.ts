import * as aws from "aws-sdk";
import { IAWSS3Configuration } from "../models/config/IAWSS3Configuration";

/**
 * Class to helper with S3.
 */
export class AmazonS3Helper {
    /**
     * Create and set the configuration for s3.
     * @param config The configuration to use for connection.
     */
    public static createClient(config: IAWSS3Configuration): aws.S3 {
        const s3Config = new aws.Config({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region
        });

        return new aws.S3(s3Config);
    }
}
