"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var amazonDynamoDbHelper_1 = require("../../utils/amazonDynamoDbHelper");
/**
 * Service to handle db requests.
 */
var AmazonDynamoDbService = /** @class */ (function () {
    function AmazonDynamoDbService(config, tableName, idName) {
        this._config = config;
        this._fullTableName = "" + this._config.dbTablePrefix + tableName;
        this._idName = idName;
    }
    /**
     * Create the table for the items.
     * @param loggingService Log output.
     */
    AmazonDynamoDbService.prototype.createTable = function (loggingService) {
        return __awaiter(this, void 0, void 0, function () {
            var dbConnection, tableParams, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loggingService.log("dynamoDb", "Creating table '" + this._fullTableName + "'");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        dbConnection = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createConnection(this._config);
                        tableParams = {
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
                        return [4 /*yield*/, dbConnection.createTable(tableParams).promise()];
                    case 2:
                        _a.sent();
                        loggingService.log("dynamoDb", "Waiting for '" + this._fullTableName + "'");
                        return [4 /*yield*/, dbConnection.waitFor("tableExists", {
                                TableName: this._fullTableName
                            }).promise()];
                    case 3:
                        _a.sent();
                        loggingService.log("dynamoDb", "Table '" + this._fullTableName + "' Created Successfully");
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        if (err_1.code === "ResourceInUseException") {
                            loggingService.log("dynamoDb", "Table '" + this._fullTableName + "' Already Exists");
                        }
                        else {
                            loggingService.error("dynamoDb", "Table '" + this._fullTableName + "' Creation Failed", err_1);
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the item.
     * @param id The id of the item to get.
     * @returns The object if it can be found or undefined.
     */
    AmazonDynamoDbService.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var docClient, key, response, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
                        key = {};
                        key[this._idName] = id;
                        return [4 /*yield*/, docClient.get({
                                TableName: this._fullTableName,
                                Key: key
                            }).promise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.Item];
                    case 2:
                        err_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set the item.
     * @param item The item to set.
     */
    AmazonDynamoDbService.prototype.set = function (id, item) {
        return __awaiter(this, void 0, void 0, function () {
            var docClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
                        item[this._idName] = id;
                        return [4 /*yield*/, docClient.put({
                                TableName: this._fullTableName,
                                Item: item
                            }).promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete the item.
     * @param itemKey The key of the item to remove.
     */
    AmazonDynamoDbService.prototype.remove = function (itemKey) {
        return __awaiter(this, void 0, void 0, function () {
            var docClient, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
                        key = {};
                        key[this._idName] = itemKey;
                        return [4 /*yield*/, docClient.delete({
                                TableName: this._fullTableName,
                                Key: key
                            }).promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    AmazonDynamoDbService.prototype.page = function (context, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var docClient, response, err_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        docClient = amazonDynamoDbHelper_1.AmazonDynamoDbHelper.createDocClient(this._config);
                        if (!(page === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, docClient.scan({
                                TableName: this._fullTableName
                            }).promise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                ids: response.Items.map(function (i) { return i[_this._idName]; }),
                                items: response.Items,
                                totalItems: response.Items.length,
                                totalPages: 1,
                                pageSize: response.Items.length
                            }];
                    case 2: return [2 /*return*/, {
                            ids: [],
                            items: [],
                            totalItems: 0,
                            totalPages: 0,
                            pageSize: 0
                        }];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        return [2 /*return*/, {
                                ids: [],
                                items: [],
                                totalItems: 0,
                                totalPages: 0,
                                pageSize: 0
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AmazonDynamoDbService;
}());
exports.AmazonDynamoDbService = AmazonDynamoDbService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uRHluYW1vRGJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25EeW5hbW9EYlNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHlFQUF3RTtBQUV4RTs7R0FFRztBQUNIO0lBZ0JJLCtCQUFZLE1BQWlDLEVBQUUsU0FBaUIsRUFBRSxNQUFjO1FBQzVFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxTQUFXLENBQUM7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNVLDJDQUFXLEdBQXhCLFVBQXlCLGNBQStCOzs7Ozs7d0JBQ3BELGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLHFCQUFtQixJQUFJLENBQUMsY0FBYyxNQUFHLENBQUMsQ0FBQzs7Ozt3QkFHaEUsWUFBWSxHQUFHLDJDQUFvQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFFbkUsV0FBVyxHQUFHOzRCQUNoQixvQkFBb0IsRUFBRTtnQ0FDbEI7b0NBQ0ksYUFBYSxFQUFFLElBQUksQ0FBQyxPQUFPO29DQUMzQixhQUFhLEVBQUUsR0FBRztpQ0FDckI7NkJBQ0o7NEJBQ0QsU0FBUyxFQUFFO2dDQUNQO29DQUNJLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTztvQ0FDM0IsT0FBTyxFQUFFLE1BQU07aUNBQ2xCOzZCQUNKOzRCQUNELHFCQUFxQixFQUFFO2dDQUNuQixpQkFBaUIsRUFBRSxDQUFDO2dDQUNwQixrQkFBa0IsRUFBRSxDQUFDOzZCQUN4Qjs0QkFDRCxTQUFTLEVBQUUsSUFBSSxDQUFDLGNB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