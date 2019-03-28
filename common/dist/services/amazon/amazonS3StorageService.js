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
var pagingHelper_1 = require("../../utils/pagingHelper");
var amazonS3Service_1 = require("./amazonS3Service");
/**
 * Service to handle the storage using the storage api.
 */
var AmazonS3StorageService = /** @class */ (function () {
    /**
     * Create a new instance of AmazonS3StorageService
     * @param config The aws configuration.
     * @param bucketName The bucket name.
     */
    function AmazonS3StorageService(config, bucketName) {
        this._config = config;
        this._bucketName = bucketName;
    }
    /**
     * Get the item.
     * @param id The id of the item.
     */
    AmazonS3StorageService.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var amazonS3Service;
            return __generator(this, function (_a) {
                amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
                return [2 /*return*/, amazonS3Service.getItem(id + ".json")];
            });
        });
    };
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    AmazonS3StorageService.prototype.set = function (id, item) {
        return __awaiter(this, void 0, void 0, function () {
            var amazonS3Service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
                        return [4 /*yield*/, amazonS3Service.putItem(id + ".json", item)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete the item.
     * @param item The item to store.
     */
    AmazonS3StorageService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var amazonS3Service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
                        return [4 /*yield*/, amazonS3Service.deleteItem(id.endsWith("/") ? id : id + ".json")];
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
    AmazonS3StorageService.prototype.page = function (context, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var amazonS3Service, allKeys, _a, firstItem, lastItem, normalizedPageSize, pageKeys, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
                        return [4 /*yield*/, amazonS3Service.list(context)];
                    case 1:
                        allKeys = _c.sent();
                        _a = pagingHelper_1.PagingHelper.normalizeRequest(page, pageSize), firstItem = _a.firstItem, lastItem = _a.lastItem, normalizedPageSize = _a.normalizedPageSize;
                        pageKeys = allKeys.slice(firstItem, lastItem);
                        _b = {
                            ids: pageKeys.map(function (id) { return id.replace(context, "").replace(".json", ""); })
                        };
                        return [4 /*yield*/, amazonS3Service.getAll(pageKeys)];
                    case 2: return [2 /*return*/, (_b.items = _c.sent(),
                            _b.totalItems = allKeys.length,
                            _b.totalPages = Math.ceil(allKeys.length / normalizedPageSize),
                            _b.pageSize = normalizedPageSize,
                            _b)];
                }
            });
        });
    };
    return AmazonS3StorageService;
}());
exports.AmazonS3StorageService = AmazonS3StorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTdG9yYWdlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hbWF6b24vYW1hem9uUzNTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEseURBQXdEO0FBQ3hELHFEQUFvRDtBQUVwRDs7R0FFRztBQUNIO0lBV0k7Ozs7T0FJRztJQUNILGdDQUFZLE1BQTJCLEVBQUUsVUFBa0I7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNVLG9DQUFHLEdBQWhCLFVBQWlCLEVBQVU7Ozs7Z0JBQ2pCLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRTVFLHNCQUFPLGVBQWUsQ0FBQyxPQUFPLENBQU8sRUFBRSxVQUFPLENBQUMsRUFBQzs7O0tBQ25EO0lBRUQ7Ozs7T0FJRztJQUNVLG9DQUFHLEdBQWhCLFVBQWlCLEVBQVUsRUFBRSxJQUFPOzs7Ozs7d0JBQzFCLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBRTVFLHFCQUFNLGVBQWUsQ0FBQyxPQUFPLENBQUksRUFBRSxVQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUE7O3dCQUFqRCxTQUFpRCxDQUFDOzs7OztLQUNyRDtJQUVEOzs7T0FHRztJQUNVLHVDQUFNLEdBQW5CLFVBQW9CLEVBQVU7Ozs7Ozt3QkFDcEIsZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFFNUUscUJBQU0sZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFJLEVBQUUsVUFBTyxDQUFDLEVBQUE7O3dCQUF0RSxTQUFzRSxDQUFDOzs7OztLQUMxRTtJQUVEOzs7Ozs7T0FNRztJQUNVLHFDQUFJLEdBQWpCLFVBQWtCLE9BQWdCLEVBQUUsSUFBc0IsRUFBRSxRQUEwQjs7Ozs7O3dCQXNCNUUsZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFFNUQscUJBQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQTs7d0JBQTdDLE9BQU8sR0FBRyxTQUFtQzt3QkFFN0MsS0FBOEMsMkJBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQXpGLFNBQVMsZUFBQSxFQUFFLFFBQVEsY0FBQSxFQUFFLGtCQUFrQix3QkFBQSxDQUFtRDt3QkFFNUYsUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs0QkFHaEQsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDOzt3QkFDOUQscUJBQU0sZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBQTs0QkFGakQsdUJBRUksUUFBSyxHQUFFLFNBQXNDOzRCQUM3QyxhQUFVLEdBQUUsT0FBTyxDQUFDLE1BQU07NEJBQzFCLGFBQVUsR0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUM7NEJBQzFELFdBQVEsR0FBRSxrQkFBa0I7aUNBQzlCOzs7O0tBQ0w7SUFDTCw2QkFBQztBQUFELENBQUMsQUFqR0QsSUFpR0M7QUFqR1ksd0RBQXNCIn0=