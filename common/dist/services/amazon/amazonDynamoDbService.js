"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws = __importStar(require("aws-sdk"));
/**
 * Service to handle db requests.
 */
class AmazonDynamoDbService {
    /**
     * Create a new instance of AmazonDynamoDbService.
     * @param config The configuration to use.
     * @param tableName The name of the db table.
     * @param idName The name of the id field.
     */
    constructor(config, tableName, idName) {
        this._config = config;
        this._fullTableName = `${this._config.dbTablePrefix}${tableName}`;
        this._idName = idName;
    }
    /**
     * Create the table for the items.
     * @param loggingService Log output.
     */
    createTable(loggingService) {
        return __awaiter(this, void 0, void 0, function* () {
            loggingService.log("dynamoDb", `Creating table '${this._fullTableName}'`);
            try {
                const dbConnection = this.createConnection();
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
                yield dbConnection.createTable(tableParams).promise();
                loggingService.log("dynamoDb", `Waiting for '${this._fullTableName}'`);
                yield dbConnection.waitFor("tableExists", {
                    TableName: this._fullTableName
                }).promise();
                loggingService.log("dynamoDb", `Table '${this._fullTableName}' Created Successfully`);
            }
            catch (err) {
                if (err.code === "ResourceInUseException") {
                    loggingService.log("dynamoDb", `Table '${this._fullTableName}' Already Exists`);
                }
                else {
                    loggingService.error("dynamoDb", `Table '${this._fullTableName}' Creation Failed`, err);
                }
            }
        });
    }
    /**
     * Get the item.
     * @param id The id of the item to get.
     * @returns The object if it can be found or undefined.
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docClient = this.createDocClient();
                const key = {};
                key[this._idName] = id;
                const response = yield docClient.get({
                    TableName: this._fullTableName,
                    Key: key
                }).promise();
                return response.Item;
            }
            catch (err) {
            }
        });
    }
    /**
     * Set the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    set(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const docClient = this.createDocClient();
            item[this._idName] = id;
            yield docClient.put({
                TableName: this._fullTableName,
                Item: item
            }).promise();
        });
    }
    /**
     * Delete the item.
     * @param itemKey The key of the item to remove.
     */
    remove(itemKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const docClient = this.createDocClient();
            const key = {};
            key[this._idName] = itemKey;
            yield docClient.delete({
                TableName: this._fullTableName,
                Key: key
            }).promise();
        });
    }
    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    page(context, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docClient = this.createDocClient();
                if (page === 0) {
                    const response = yield docClient.scan({
                        TableName: this._fullTableName
                    }).promise();
                    return {
                        ids: response.Items.map(i => i[this._idName]),
                        items: response.Items,
                        totalItems: response.Items.length,
                        totalPages: 1,
                        pageSize: response.Items.length
                    };
                }
                else {
                    return {
                        ids: [],
                        items: [],
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0
                    };
                }
            }
            catch (err) {
                return {
                    ids: [],
                    items: [],
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                };
            }
        });
    }
    /**
     * Create and set the configuration for db.
     */
    createAndSetConfig() {
        const awsConfig = new aws.Config({
            accessKeyId: this._config.accessKeyId,
            secretAccessKey: this._config.secretAccessKey,
            region: this._config.region
        });
        aws.config.update(awsConfig);
    }
    /**
     * Create a new DB connection.
     * @returns DynamoDB client instance.
     */
    createConnection() {
        this.createAndSetConfig();
        return new aws.DynamoDB({ apiVersion: "2012-10-08" });
    }
    /**
     * Create a doc client connection.
     * @returns DynamoDB doc client instance.
     */
    createDocClient() {
        this.createAndSetConfig();
        return new aws.DynamoDB.DocumentClient({
            apiVersion: "2012-10-08",
            convertEmptyValues: true
        });
    }
}
exports.AmazonDynamoDbService = AmazonDynamoDbService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uRHluYW1vRGJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25EeW5hbW9EYlNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBSy9COztHQUVHO0FBQ0gsTUFBc0IscUJBQXFCO0lBZ0J2Qzs7Ozs7T0FLRztJQUNILFlBQVksTUFBaUMsRUFBRSxTQUFpQixFQUFFLE1BQWM7UUFDNUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDVSxXQUFXLENBQUMsY0FBK0I7O1lBQ3BELGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLG1CQUFtQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztZQUUxRSxJQUFJO2dCQUNBLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUU3QyxNQUFNLFdBQVcsR0FBRztvQkFDaEIsb0JBQW9CLEVBQUU7d0JBQ2xCOzRCQUNJLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTzs0QkFDM0IsYUFBYSxFQUFFLEdBQUc7eUJBQ3JCO3FCQUNKO29CQUNELFNBQVMsRUFBRTt3QkFDUDs0QkFDSSxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU87NEJBQzNCLE9BQU8sRUFBRSxNQUFNO3lCQUNsQjtxQkFDSjtvQkFDRCxxQkFBcUIsRUFBRTt3QkFDbkIsaUJBQWlCLEVBQUUsQ0FBQzt3QkFDcEIsa0JBQWtCLEVBQUUsQ0FBQztxQkFDeEI7b0JBQ0QsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjO2lC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