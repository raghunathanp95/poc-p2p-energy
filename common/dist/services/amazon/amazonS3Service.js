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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25TM1NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBSy9COztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBV3hCOzs7O09BSUc7SUFDSCxZQUFZLE1BQTJCLEVBQUUsVUFBa0I7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEdBQUcsVUFBVSxFQUFFLENBQUM7SUFDakUsQ0FBQztJQUVEOzs7T0FHRztJQUNVLFlBQVksQ0FBQyxjQUErQjs7WUFDckQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1lBRXRFLElBQUk7Z0JBQ0EsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUUvQixNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBZTtvQkFDNUIseUJBQXlCLEVBQUU7d0JBQ3ZCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtxQkFDMUM7aUJBQ0osQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUViLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsSUFBSSxDQUFDLGVBQWUsd0JBQXdCLENBQUMsQ0FBQzthQUNyRjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyx5QkFBeUIsRUFBRTtvQkFDeEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxJQUFJLENBQUMsZUFBZSxrQkFBa0IsQ0FBQyxDQUFDO2lC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