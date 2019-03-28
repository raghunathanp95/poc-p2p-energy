import { IAWSS3Configuration } from "../../models/config/IAWSS3Configuration";
import { IStorageService } from "../../models/services/IStorageService";
/**
 * Service to handle the storage using the storage api.
 */
export declare class AmazonS3StorageService<T> implements IStorageService<T> {
    /**
     * The aws configuration.
     */
    private readonly _config;
    /**
     * The amazon s3 bucket name.
     */
    private readonly _bucketName;
    /**
     * Create a new instance of AmazonS3StorageService
     * @param config The aws configuration.
     * @param bucketName The bucket name.
     */
    constructor(config: IAWSS3Configuration, bucketName: string);
    /**
     * Get the item.
     * @param id The id of the item.
     */
    get(id: string): Promise<T>;
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    set(id: string, item: T): Promise<void>;
    /**
     * Delete the item.
     * @param item The item to store.
     */
    remove(id: string): Promise<void>;
    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    page(context?: string, page?: number | string, pageSize?: number | string): Promise<{
        /**
         * The ids of the items retrieved.
         */
        ids: string[];
        /**
         * The items.
         */
        items: T[];
        /**
         * The total number of items.
         */
        totalItems: number;
        /**
         * The total number of pages.
         */
        totalPages: number;
        /**
         * The page size.
         */
        pageSize: number;
    }>;
}
