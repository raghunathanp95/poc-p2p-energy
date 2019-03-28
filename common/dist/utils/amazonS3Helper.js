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
 * Class to helper with S3.
 */
var AmazonS3Helper = /** @class */ (function () {
    function AmazonS3Helper() {
    }
    /**
     * Create and set the configuration for s3.
     * @param config The configuration to use for connection.
     */
    AmazonS3Helper.createClient = function (config) {
        var s3Config = new aws.Config({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region
        });
        return new aws.S3(s3Config);
    };
    return AmazonS3Helper;
}());
exports.AmazonS3Helper = AmazonS3Helper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvYW1hem9uUzNIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkNBQStCO0FBRy9COztHQUVHO0FBQ0g7SUFBQTtJQWNBLENBQUM7SUFiRzs7O09BR0c7SUFDVywyQkFBWSxHQUExQixVQUEyQixNQUEyQjtRQUNsRCxJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDNUIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZTtZQUN2QyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07U0FDeEIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQWRELElBY0M7QUFkWSx3Q0FBYyJ9