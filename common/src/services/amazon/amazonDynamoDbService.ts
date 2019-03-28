import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { ILoggingService } from "../../models/services/ILoggingService";
import { IStorageService } from "../../models/services/IStorageService";
import { AmazonDynamoDbHelper } from "../../utils/amazonDynamoDbHelper";

/**
 * Service to handle db requests.
 */
export abstract class AmazonDynamoDbService<T> implements IStorageService<T> {
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

    constructor(config: IAWSDynamoDbConfiguration, tableName: string, idName: string) {
        this._config = config;
        this._fullTableName = `${this._config.dbTablePrefix}${tableName}`;
        this._idName = idName;
    }

    /**
     * Create the table for the items.
     * @param loggingService Log output.
     */
    public async createTable(loggingService: ILoggingService): Promise<void> {
        loggingService.log("dynamoDb", `Creating table '${this._fullTableName}'`);

        try {
            const dbConnection = AmazonDynamoDbHelper.createConnection(this._config);

            const tableParams = {
                AttributeDefinitions: [
                    {
                        AttributeName: this._idName,
                        AttributeType: "S"
                    }
                ],
                KeySchema: [
                    {
                        AttributeName: this._idName,
                        KeyType: "HASH"
                    }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                },
                TableName: this._fullTableName
            };

            await dbConnection.createTable(tableParams).promise();

            loggingService.log("dynamoDb", `Waiting for '${this._fullTableName}'`);

            await dbConnection.waitFor("tableExists", {
                TableName: this._fullTableName
            }).promise();

            loggingService.log("dynamoDb", `Table '${this._fullTableName}' Created Successfully`);
        } catch (err) {
            if (err.code === "ResourceInUseException") {
                loggingService.log("dynamoDb", `Table '${this._fullTableName}' Already Exists`);
            } else {
                loggingService.error("dynamoDb", `Table '${this._fullTableName}' Creation Failed`, err);
            }
        }
    }

    /**
     * Get the item.
     * @param id The id of the item to get.
     * @returns The object if it can be found or undefined.
     */
    public async get(id: string): Promise<T> {
        try {
            const docClient = AmazonDynamoDbHelper.createDocClient(this._config);

            const key = {};
            key[this._idName] = id;

            const response = await docClient.get({
                TableName: this._fullTableName,
                Key: key
            }).promise();

            return <T>response.Item;
        } catch (err) {
        }
    }

    /**
     * Set the item.
     * @param item The item to set.
     */
    public async set(id: string, item: T): Promise<void> {
        const docClient = AmazonDynamoDbHelper.createDocClient(this._config);

        item[this._idName] = id;

        await docClient.put({
            TableName: this._fullTableName,
            Item: item
        }).promise();
    }

    /**
     * Delete the item.
     * @param itemKey The key of the item to remove.
     */
    public async remove(itemKey: string): Promise<void> {
        const docClient = AmazonDynamoDbHelper.createDocClient(this._config);

        const key = {};
        key[this._idName] = itemKey;

        await docClient.delete({
            TableName: this._fullTableName,
            Key: key
        }).promise();
    }

    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    public async page(context?: string, page?: number | string, pageSize?: number | string): Promise<{
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
    }> {
        try {
            const docClient = AmazonDynamoDbHelper.createDocClient(this._config);

            if (page === 0) {
                const response = await docClient.scan({
                    TableName: this._fullTableName
                }).promise();

                return {
                    ids: response.Items.map(i => i[this._idName]),
                    items: <T[]>response.Items,
                    totalItems: response.Items.length,
                    totalPages: 1,
                    pageSize: response.Items.length
                };
            } else {
                return {
                    ids: [],
                    items: [],
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                };
            }
        } catch (err) {
            return {
                ids: [],
                items: [],
                totalItems: 0,
                totalPages: 0,
                pageSize: 0
            };
        }
    }
}
