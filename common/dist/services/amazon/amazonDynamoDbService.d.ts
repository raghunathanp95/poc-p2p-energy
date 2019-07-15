import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { ILoggingService } from "../../models/services/ILoggingService";
import { IStorageService } from "../../models/services/IStorageService";
/**
 * Service to handle db requests.
 */
export declare abstract class AmazonDynamoDbService<T> implements IStorageService<T> {
    /**
     * The name of the database table.
     */
    protected _fullTableName: string;
    /**
     * Configuration to connection to AWS.
     */
    protected readonly _config: IAWSDynamoDbConfiguration;
    /**
     * The id field name.
     */
    protected readonly _idName: string;
    /**
     * Create a new instance of AmazonDynamoDbService.
     * @param config The configuration to use.
     * @param tableName The name of the db table.
     * @param idName The name of the id field.
     */
    constructor(config: IAWSDynamoDbConfiguration, tableName: string, idName: string);
    /**
     * Create the table for the items.
     * @param loggingService Log output.
     */
    createTable(loggingService: ILoggingService): Promise<void>;
    /**
     * Get the item.
     * @param id The id of the item to get.
     * @returns The object if it can be found or undefined.
     */
    get(id: string): Promise<T>;
    /**
     * Set the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    set(id: string, item: T): Promise<void>;
    /**
     * Delete the item.
     * @param itemKey The key of the item to remove.
     */
    remove(itemKey: string): Promise<void>;
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
    /**
     * Create and set the configuration for db.
     */
    private createAndSetConfig;
    /**
     * Create a new DB connection.
     * @returns DynamoDB client instance.
     */
    private createConnection;
    /**
     * Create a doc client connection.
     * @returns DynamoDB doc client instance.
     */
    private createDocClient;
}
