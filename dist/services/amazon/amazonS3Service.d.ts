/// <reference types="node" />
import { ObjectCannedACL } from "aws-sdk/clients/s3";
import { IAWSS3Configuration } from "../../models/config/IAWSS3Configuration";
import { ILoggingService } from "../../models/services/ILoggingService";
/**
 * Class to communicate with amazon s3.
 */
export declare class AmazonS3Service {
    /**
     * S3 Configuration.
     */
    private readonly _config;
    /**
     * Full bucket name.
     */
    private readonly _fullBucketName;
    /**
     * Create a new instance of AmazonS3Service.
     * @param config The configuration for the s3 service.
     * @param bucketName The name of the bucket to use.
     */
    constructor(config: IAWSS3Configuration, bucketName: string);
    /**
     * Create the bucket on S3.
     * @param loggingService Log output.
     */
    createBucket(loggingService: ILoggingService): Promise<void>;
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    getItem<T>(itemName: string): Promise<T>;
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    getString(itemName: string): Promise<string>;
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    getBinary(itemName: string): Promise<Buffer>;
    /**
     * Put an item into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    putItem<T>(itemName: string, data: T, acl?: ObjectCannedACL): Promise<void>;
    /**
     * Put a string into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    putString(itemName: string, data: string, acl?: ObjectCannedACL): Promise<void>;
    /**
     * Put binary data into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    putBinary(itemName: string, data: Buffer, acl?: ObjectCannedACL): Promise<void>;
    /**
     * Delete an item from the bucket.
     * @param itemName The name of the item to delete.
     */
    deleteItem(itemName: string): Promise<void>;
    /**
     * Does an item exist.
     * @param itemName The name of the item to check for existence.
     * @returns True if the item exists.
     */
    existsItem(itemName: string): Promise<boolean>;
    /**
     * List all the items prefixed with the specified name.
     * @param prefix The prefix of the items to get.
     * @returns All the items with the provided prefix.
     */
    list(prefix: string): Promise<string[]>;
    /**
     * Get all the items with the specified keys.
     * @param keys The prefix of the items to get.
     * @returns All the items with the provided prefix.
     */
    getAll<T>(keys: string[]): Promise<T[]>;
    /**
     * Create and set the configuration for s3.
     * @param config The configuration to use for connection.
     * @returns Client instance.
     */
    private createClient;
}
