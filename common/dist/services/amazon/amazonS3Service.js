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
 * Class to communicate with amazon s3.
 */
class AmazonS3Service {
    /**
     * Create a new instance of AmazonS3Service.
     * @param config The configuration for the s3 service.
     * @param bucketName The name of the bucket to use.
     */
    constructor(config, bucketName) {
        this._config = config;
        this._fullBucketName = `${config.bucketPrefix}${bucketName}`;
    }
    /**
     * Create the bucket on S3.
     * @param loggingService Log output.
     */
    createBucket(loggingService) {
        return __awaiter(this, void 0, void 0, function* () {
            loggingService.log("s3", `Creating Bucket' ${this._fullBucketName}'`);
            try {
                const s3 = this.createClient();
                yield s3.createBucket({
                    Bucket: this._fullBucketName,
                    CreateBucketConfiguration: {
                        LocationConstraint: this._config.region
                    }
                }).promise();
                loggingService.log("s3", `Bucket '${this._fullBucketName}' Created Successfully`);
            }
            catch (err) {
                if (err.code === "BucketAlreadyOwnedByYou") {
                    loggingService.log("s3", `Bucket '${this._fullBucketName}' Already exists`);
                }
                else {
                    loggingService.error("s3", `Bucket '${this._fullBucketName}' Failed`, err);
                }
            }
        });
    }
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    getItem(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            try {
                const bucketData = yield s3.getObject({
                    Bucket: this._fullBucketName,
                    Key: itemName
                }).promise();
                return JSON.parse(bucketData.Body.toString());
            }
            catch (err) {
                if (err.code === "NoSuchKey") {
                    return undefined;
                }
                else {
                    throw (err);
                }
            }
        });
    }
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    getString(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            try {
                const bucketData = yield s3.getObject({
                    Bucket: this._fullBucketName,
                    Key: itemName
                }).promise();
                return bucketData.Body.toString();
            }
            catch (err) {
                if (err.code === "NoSuchKey") {
                    return undefined;
                }
                else {
                    throw (err);
                }
            }
        });
    }
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    getBinary(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            try {
                const bucketData = yield s3.getObject({
                    Bucket: this._fullBucketName,
                    Key: itemName
                }).promise();
                return Buffer.from(bucketData.Body.toString());
            }
            catch (err) {
                if (err.code === "NoSuchKey") {
                    return undefined;
                }
                else {
                    throw (err);
                }
            }
        });
    }
    /**
     * Put an item into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    putItem(itemName, data, acl) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            const json = JSON.stringify(data);
            return s3.putObject({
                Bucket: this._fullBucketName,
                Key: itemName,
                Body: json,
                ACL: acl
            }).promise().then(() => undefined);
        });
    }
    /**
     * Put a string into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    putString(itemName, data, acl) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            return s3.putObject({
                Bucket: this._fullBucketName,
                Key: itemName,
                Body: data,
                ACL: acl
            }).promise().then(() => undefined);
        });
    }
    /**
     * Put binary data into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    putBinary(itemName, data, acl) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            return s3.putObject({
                Bucket: this._fullBucketName,
                Key: itemName,
                Body: data,
                ACL: acl
            }).promise().then(() => undefined);
        });
    }
    /**
     * Delete an item from the bucket.
     * @param itemName The name of the item to delete.
     */
    deleteItem(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            if (itemName.endsWith("/")) {
                let finished = false;
                do {
                    const listedObjects = yield s3.listObjectsV2({
                        Bucket: this._fullBucketName,
                        Prefix: itemName
                    }).promise();
                    if (listedObjects.Contents.length > 0) {
                        yield s3.deleteObjects({
                            Bucket: this._fullBucketName,
                            Delete: { Objects: listedObjects.Contents.map(item => ({ Key: item.Key })) }
                        }).promise();
                        finished = !listedObjects.IsTruncated;
                    }
                    else {
                        finished = true;
                    }
                } while (!finished);
            }
            else {
                yield s3.deleteObject({
                    Bucket: this._fullBucketName,
                    Key: itemName
                }).promise();
            }
        });
    }
    /**
     * Does an item exist.
     * @param itemName The name of the item to check for existence.
     * @returns True if the item exists.
     */
    existsItem(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = this.createClient();
            try {
                yield s3.headObject({
                    Bucket: this._fullBucketName,
                    Key: itemName
                }).promise();
                return true;
            }
            catch (err) {
                if (err.statusCode === 404 || err.code === "NoSuchKey") {
                    return false;
                }
                else {
                    throw (err);
                }
            }
        });
    }
    /**
     * List all the items prefixed with the specified name.
     * @param prefix The prefix of the items to get.
     * @returns All the items with the provided prefix.
     */
    list(prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = [];
            const s3 = this.createClient();
            let finished = false;
            do {
                const listedObjects = yield s3.listObjectsV2({
                    Bucket: this._fullBucketName,
                    Prefix: prefix
                }).promise();
                if (listedObjects.Contents.length > 0) {
                    for (let i = 0; i < listedObjects.Contents.length; i++) {
                        if (listedObjects.Contents[i].Size > 0) {
                            keys.push(listedObjects.Contents[i].Key);
                        }
                    }
                    finished = !listedObjects.IsTruncated;
                }
                else {
                    finished = true;
                }
            } while (!finished);
            return keys;
        });
    }
    /**
     * Get all the items with the specified keys.
     * @param keys The prefix of the items to get.
     * @returns All the items with the provided prefix.
     */
    getAll(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [];
            const s3 = this.createClient();
            for (let i = 0; i < keys.length; i++) {
                const bucketData = yield s3.getObject({
                    Bucket: this._fullBucketName,
                    Key: keys[i]
                }).promise();
                try {
                    items.push(JSON.parse(bucketData.Body.toString()));
                }
                catch (err) {
                    items.push(undefined);
                }
            }
            return items;
        });
    }
    /**
     * Create and set the configuration for s3.
     * @param config The configuration to use for connection.
     * @returns Client instance.
     */
    createClient() {
        const s3Config = new aws.Config({
            accessKeyId: this._config.accessKeyId,
            secretAccessKey: this._config.secretAccessKey,
            region: this._config.region
        });
        return new aws.S3(s3Config);
    }
}
exports.AmazonS3Service = AmazonS3Service;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25TM1NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFLL0I7O0dBRUc7QUFDSCxNQUFhLGVBQWU7SUFXeEI7Ozs7T0FJRztJQUNILFlBQVksTUFBMkIsRUFBRSxVQUFrQjtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksR0FBRyxVQUFVLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsWUFBWSxDQUFDLGNBQStCOztZQUNyRCxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxvQkFBb0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7WUFFdEUsSUFBSTtnQkFDQSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBRS9CLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDbEIsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlO29CQUM1Qix5QkFBeUIsRUFBRTt3QkFDdkIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO3FCQUMxQztpQkFDSixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRWIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxJQUFJLENBQUMsZUFBZSx3QkFBd0IsQ0FBQyxDQUFDO2FBQ3JGO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLHlCQUF5QixFQUFFO29CQUN4QyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLElBQUksQ0FBQyxlQUFlLGtCQUFrQixDQUFDLENBQUM7aUJB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