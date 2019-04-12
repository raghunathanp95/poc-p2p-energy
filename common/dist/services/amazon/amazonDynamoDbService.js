"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amazonDynamoDbHelper_1 = require("../../utils/amazonDynamoDbHelper");
/**
 * Service to handle db requests.
 */
class AmazonDynamoDbService {
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
                const dbConnection = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createConnection(this._config);
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
                const docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
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
     * @param item The item to set.
     */
    set(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
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
            const docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
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
                const docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
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
}
exports.AmazonDynamoDbService = AmazonDynamoDbService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uRHluYW1vRGJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25EeW5hbW9EYlNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLDJFQUF3RTtBQUV4RTs7R0FFRztBQUNILE1BQXNCLHFCQUFxQjtJQWdCdkMsWUFBWSxNQUFpQyxFQUFFLFNBQWlCLEVBQUUsTUFBYztRQUM1RSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsU0FBUyxFQUFFLENBQUM7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNVLFdBQVcsQ0FBQyxjQUErQjs7WUFDcEQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO1lBRTFFLElBQUk7Z0JBQ0EsTUFBTSxZQUFZLEdBQUcsMkNBQW9CLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV6RSxNQUFNLFdBQVcsR0FBRztvQkFDaEIsb0JBQW9CLEVBQUU7d0JBQ2xCOzRCQUNJLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTzs0QkFDM0IsYUFBYSxFQUFFLEdBQUc7eUJBQ3JCO3FCQUNKO29CQUNELFNBQVMsRUFBRTt3QkFDUDs0QkFDSSxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU87NEJBQzNCLE9BQU8sRUFBRSxNQUFNO3lCQUNsQjtxQkFDSjtvQkFDRCxxQkFBcUIsRUFBRTt3QkFDbkIsaUJBQWlCLEVBQUUsQ0FBQzt3QkFDcEIsa0JBQWtCLEVBQUUsQ0FBQztxQkFDeEI7b0JBQ0QsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjO2lC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