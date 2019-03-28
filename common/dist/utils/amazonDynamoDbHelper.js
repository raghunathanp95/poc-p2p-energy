"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws = __importStar(require("aws-sdk"));
/**
 * Class to helper with database.
 */
var AmazonDynamoDbHelper = /** @class */ (function () {
    function AmazonDynamoDbHelper() {
    }
    /**
     * Create and set the configuration for db.
     * @param config The configuration to use for connection.
     */
    AmazonDynamoDbHelper.createAndSetConfig = function (config) {
        var awsConfig = new aws.Config({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region
        });
        aws.config.update(awsConfig);
    };
    /**
     * Create a new DB connection.
     * @param config The configuration for the connection.
     */
    AmazonDynamoDbHelper.createConnection = function (config) {
        AmazonDynamoDbHelper.createAndSetConfig(config);
        return new aws.DynamoDB({ apiVersion: "2012-10-08" });
    };
    /**
     * Create a doc client connection.
     * @param config The configuration to use for connection.
     */
    AmazonDynamoDbHelper.createDocClient = function (config) {
        AmazonDynamoDbHelper.createAndSetConfig(config);
        return new aws.DynamoDB.DocumentClient({
            apiVersion: "2012-10-08",
            convertEmptyValues: true
        });
    };
    return AmazonDynamoDbHelper;
}());
exports.AmazonDynamoDbHelper = AmazonDynamoDbHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uRHluYW1vRGJIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvYW1hem9uRHluYW1vRGJIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkNBQStCO0FBRy9COztHQUVHO0FBQ0g7SUFBQTtJQXFDQSxDQUFDO0lBcENHOzs7T0FHRztJQUNXLHVDQUFrQixHQUFoQyxVQUFpQyxNQUFpQztRQUM5RCxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDN0IsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZTtZQUN2QyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07U0FDeEIsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNXLHFDQUFnQixHQUE5QixVQUErQixNQUFpQztRQUM1RCxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7O09BR0c7SUFDVyxvQ0FBZSxHQUE3QixVQUE4QixNQUFpQztRQUMzRCxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDbkMsVUFBVSxFQUFFLFlBQVk7WUFDeEIsa0JBQWtCLEVBQUUsSUFBSTtTQUMzQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsMkJBQUM7QUFBRCxDQUFDLEFBckNELElBcUNDO0FBckNZLG9EQUFvQiJ9