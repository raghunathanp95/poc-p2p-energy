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
var amazonS3Helper_1 = require("../../utils/amazonS3Helper");
/**
 * Class to communicate with amazon s3.
 */
var AmazonS3Service = /** @class */ (function () {
    /**
     * Create a new instance of AmazonS3Service.
     * @param config The configuration for the s3 service.
     * @param bucketName The name of the bucket to use.
     */
    function AmazonS3Service(config, bucketName) {
        this._config = config;
        this._fullBucketName = "" + config.bucketPrefix + bucketName;
    }
    /**
     * Create the bucket on S3.
     * @param loggingService Log output.
     */
    AmazonS3Service.prototype.createBucket = function (loggingService) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loggingService.log("s3", "Creating Bucket' " + this._fullBucketName + "'");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        return [4 /*yield*/, s3.createBucket({
                                Bucket: this._fullBucketName,
                                CreateBucketConfiguration: {
                                    LocationConstraint: this._config.region
                                }
                            }).promise()];
                    case 2:
                        _a.sent();
                        loggingService.log("s3", "Bucket '" + this._fullBucketName + "' Created Successfully");
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        if (err_1.code === "BucketAlreadyOwnedByYou") {
                            loggingService.log("s3", "Bucket '" + this._fullBucketName + "' Already exists");
                        }
                        else {
                            loggingService.error("s3", "Bucket '" + this._fullBucketName + "' Failed", err_1);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    AmazonS3Service.prototype.getItem = function (itemName) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, bucketData, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, s3.getObject({
                                Bucket: this._fullBucketName,
                                Key: itemName
                            }).promise()];
                    case 2:
                        bucketData = _a.sent();
                        return [2 /*return*/, JSON.parse(bucketData.Body.toString())];
                    case 3:
                        err_2 = _a.sent();
                        if (err_2.code === "NoSuchKey") {
                            return [2 /*return*/, undefined];
                        }
                        else {
                            throw (err_2);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    AmazonS3Service.prototype.getString = function (itemName) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, bucketData, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, s3.getObject({
                                Bucket: this._fullBucketName,
                                Key: itemName
                            }).promise()];
                    case 2:
                        bucketData = _a.sent();
                        return [2 /*return*/, bucketData.Body.toString()];
                    case 3:
                        err_3 = _a.sent();
                        if (err_3.code === "NoSuchKey") {
                            return [2 /*return*/, undefined];
                        }
                        else {
                            throw (err_3);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get an item from the s3 bucket.
     * @param itemName The name of the item to get.
     * @returns The item if it exists, undefined if it doesn't or could throw an error.
     */
    AmazonS3Service.prototype.getBinary = function (itemName) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, bucketData, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, s3.getObject({
                                Bucket: this._fullBucketName,
                                Key: itemName
                            }).promise()];
                    case 2:
                        bucketData = _a.sent();
                        return [2 /*return*/, Buffer.from(bucketData.Body.toString())];
                    case 3:
                        err_4 = _a.sent();
                        if (err_4.code === "NoSuchKey") {
                            return [2 /*return*/, undefined];
                        }
                        else {
                            throw (err_4);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Put an item into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    AmazonS3Service.prototype.putItem = function (itemName, data, acl) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, json;
            return __generator(this, function (_a) {
                s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                json = JSON.stringify(data);
                return [2 /*return*/, s3.putObject({
                        Bucket: this._fullBucketName,
                        Key: itemName,
                        Body: json,
                        ACL: acl
                    }).promise().then(function () { return undefined; })];
            });
        });
    };
    /**
     * Put a string into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    AmazonS3Service.prototype.putString = function (itemName, data, acl) {
        return __awaiter(this, void 0, void 0, function () {
            var s3;
            return __generator(this, function (_a) {
                s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                return [2 /*return*/, s3.putObject({
                        Bucket: this._fullBucketName,
                        Key: itemName,
                        Body: data,
                        ACL: acl
                    }).promise().then(function () { return undefined; })];
            });
        });
    };
    /**
     * Put binary data into the s3 bucket.
     * @param itemName The name of the item to put.
     * @param data The data to put for the item.
     * @param acl The ACL for storing the file.
     * @returns Promise.
     */
    AmazonS3Service.prototype.putBinary = function (itemName, data, acl) {
        return __awaiter(this, void 0, void 0, function () {
            var s3;
            return __generator(this, function (_a) {
                s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                return [2 /*return*/, s3.putObject({
                        Bucket: this._fullBucketName,
                        Key: itemName,
                        Body: data,
                        ACL: acl
                    }).promise().then(function () { return undefined; })];
            });
        });
    };
    /**
     * Delete an item from the bucket.
     * @param itemName The name of the item to delete.
     */
    AmazonS3Service.prototype.deleteItem = function (itemName) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, finished, listedObjects;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        if (!itemName.endsWith("/")) return [3 /*break*/, 7];
                        finished = false;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, s3.listObjectsV2({
                            Bucket: this._fullBucketName,
                            Prefix: itemName
                        }).promise()];
                    case 2:
                        listedObjects = _a.sent();
                        if (!(listedObjects.Contents.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, s3.deleteObjects({
                                Bucket: this._fullBucketName,
                                Delete: { Objects: listedObjects.Contents.map(function (item) { return ({ Key: item.Key }); }) }
                            }).promise()];
                    case 3:
                        _a.sent();
                        finished = !listedObjects.IsTruncated;
                        return [3 /*break*/, 5];
                    case 4:
                        finished = true;
                        _a.label = 5;
                    case 5:
                        if (!finished) return [3 /*break*/, 1];
                        _a.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, s3.deleteObject({
                            Bucket: this._fullBucketName,
                            Key: itemName
                        }).promise()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Does an item exist.
     * @param itemName The name of the item to check for existence.
     */
    AmazonS3Service.prototype.existsItem = function (itemName) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, s3.headObject({
                                Bucket: this._fullBucketName,
                                Key: itemName
                            }).promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_5 = _a.sent();
                        if (err_5.statusCode === 404 || err_5.code === "NoSuchKey") {
                            return [2 /*return*/, false];
                        }
                        else {
                            throw (err_5);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all the items prefixed with the specified name.
     * @param prefix The prefix of the items to get.
     * @returns All the items with the provided prefix.
     */
    AmazonS3Service.prototype.list = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, s3, finished, listedObjects, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = [];
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        finished = false;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, s3.listObjectsV2({
                            Bucket: this._fullBucketName,
                            Prefix: prefix
                        }).promise()];
                    case 2:
                        listedObjects = _a.sent();
                        if (listedObjects.Contents.length > 0) {
                            for (i = 0; i < listedObjects.Contents.length; i++) {
                                if (listedObjects.Contents[i].Size > 0) {
                                    keys.push(listedObjects.Contents[i].Key);
                                }
                            }
                            finished = !listedObjects.IsTruncated;
                        }
                        else {
                            finished = true;
                        }
                        _a.label = 3;
                    case 3:
                        if (!finished) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, keys];
                }
            });
        });
    };
    /**
     * Get all the items with the specified keys.
     * @param keys The prefix of the items to get.
     * @returns All the items with the provided prefix.
     */
    AmazonS3Service.prototype.getAll = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            var items, s3, i, bucketData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        s3 = amazonS3Helper_1.AmazonS3Helper.createClient(this._config);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < keys.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, s3.getObject({
                                Bucket: this._fullBucketName,
                                Key: keys[i]
                            }).promise()];
                    case 2:
                        bucketData = _a.sent();
                        try {
                            items.push(JSON.parse(bucketData.Body.toString()));
                        }
                        catch (err) {
                            items.push(undefined);
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, items];
                }
            });
        });
    };
    return AmazonS3Service;
}());
exports.AmazonS3Service = AmazonS3Service;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25TM1NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLDZEQUE0RDtBQUU1RDs7R0FFRztBQUNIO0lBV0k7Ozs7T0FJRztJQUNILHlCQUFZLE1BQTJCLEVBQUUsVUFBa0I7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFHLE1BQU0sQ0FBQyxZQUFZLEdBQUcsVUFBWSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxzQ0FBWSxHQUF6QixVQUEwQixjQUErQjs7Ozs7O3dCQUNyRCxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxzQkFBb0IsSUFBSSxDQUFDLGVBQWUsTUFBRyxDQUFDLENBQUM7Ozs7d0JBRzVELEVBQUUsR0FBRywrQkFBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBRXJELHFCQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0NBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBZTtnQ0FDNUIseUJBQXlCLEVBQUU7b0NBQ3ZCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtpQ0FDMUM7NkJBQ0osQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFBOzt3QkFMWixTQUtZLENBQUM7d0JBRWIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBVyxJQUFJLENBQUMsZUFBZSwyQkFBd0IsQ0FBQyxDQUFDOzs7O3dCQUVsRixJQUFJLEtBQUcsQ0FBQyxJQUFJLEtBQUsseUJBQXlCLEVBQUU7NEJBQ3hDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGFBQVcsSUFBSSxDQUFDLGVB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