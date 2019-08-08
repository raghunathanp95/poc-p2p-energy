"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uRHluYW1vRGJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25EeW5hbW9EYlNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFLL0I7O0dBRUc7QUFDSCxNQUFzQixxQkFBcUI7SUFnQnZDOzs7OztPQUtHO0lBQ0gsWUFBWSxNQUFpQyxFQUFFLFNBQWlCLEVBQUUsTUFBYztRQUM1RSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsU0FBUyxFQUFFLENBQUM7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNVLFdBQVcsQ0FBQyxjQUErQjs7WUFDcEQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO1lBRTFFLElBQUk7Z0JBQ0EsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBRTdDLE1BQU0sV0FBVyxHQUFHO29CQUNoQixvQkFBb0IsRUFBRTt3QkFDbEI7NEJBQ0ksYUFBYSxFQUFFLElBQUksQ0FBQyxPQUFPOzRCQUMzQixhQUFhLEVBQUUsR0FBRzt5QkFDckI7cUJBQ0o7b0JBQ0QsU0FBUyxFQUFFO3dCQUNQOzRCQUNJLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTzs0QkFDM0IsT0FBTyxFQUFFLE1BQU07eUJBQ2xCO3FCQUNKO29CQUNELHFCQUFxQixFQUFFO3dCQUNuQixpQkFBaUIsRUFBRSxDQUFDO3dCQUNwQixrQkFBa0IsRUFBRSxDQUFDO3FCQUN4QjtvQkFDRCxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWM7aUJB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