import * as aws from "aws-sdk";
import { IAWSS3Configuration } from "../models/config/IAWSS3Configuration";
/**
 * Class to helper with S3.
 */
export declare class AmazonS3Helper {
    /**
     * Create and set the configuration for s3.
     * @param config The configuration to use for connection.
     */
    static createClient(config: IAWSS3Configuration): aws.S3;
}
