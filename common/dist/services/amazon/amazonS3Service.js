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
const amazonS3Helper_1 = require("../../utils/amazonS3Helper");
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
                const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
     */
    existsItem(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
            const s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
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
}
exports.AmazonS3Service = AmazonS3Service;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25TM1NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLCtEQUE0RDtBQUU1RDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQVd4Qjs7OztPQUlHO0lBQ0gsWUFBWSxNQUEyQixFQUFFLFVBQWtCO1FBQ3ZELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxHQUFHLFVBQVUsRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxZQUFZLENBQUMsY0FBK0I7O1lBQ3JELGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLG9CQUFvQixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztZQUV0RSxJQUFJO2dCQUNBLE1BQU0sRUFBRSxHQUFHLCtCQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFckQsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUNsQixNQUFNLEVBQUUsSUFBSSxDQUFDLGVBQWU7b0JBQzVCLHlCQUF5QixFQUFFO3dCQUN2QixrQkFBa0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07cUJBQzFDO2lCQUNKLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFFYixjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLElBQUksQ0FBQyxlQUFlLHdCQUF3QixDQUFDLENBQUM7YUFDckY7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUsseUJBQXlCLEVBQUU7b0JBQ3hDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsSUFBSSxDQUFDLGVBQWUsa0JBQWtC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