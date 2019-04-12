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
const pagingHelper_1 = require("../../utils/pagingHelper");
const amazonS3Service_1 = require("./amazonS3Service");
/**
 * Service to handle the storage using the storage api.
 */
class AmazonS3StorageService {
    /**
     * Create a new instance of AmazonS3StorageService
     * @param config The aws configuration.
     * @param bucketName The bucket name.
     */
    constructor(config, bucketName) {
        this._config = config;
        this._bucketName = bucketName;
    }
    /**
     * Get the item.
     * @param id The id of the item.
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
            return amazonS3Service.getItem(`${id}.json`);
        });
    }
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    set(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
            yield amazonS3Service.putItem(`${id}.json`, item);
        });
    }
    /**
     * Delete the item.
     * @param item The item to store.
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
            yield amazonS3Service.deleteItem(id.endsWith("/") ? id : `${id}.json`);
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
            const amazonS3Service = new amazonS3Service_1.AmazonS3Service(this._config, this._bucketName);
            const allKeys = yield amazonS3Service.list(context);
            const { firstItem, lastItem, normalizedPageSize } = pagingHelper_1.PagingHelper.normalizeRequest(page, pageSize);
            const pageKeys = allKeys.slice(firstItem, lastItem);
            return {
                ids: pageKeys.map(id => id.replace(context, "").replace(".json", "")),
                items: yield amazonS3Service.getAll(pageKeys),
                totalItems: allKeys.length,
                totalPages: Math.ceil(allKeys.length / normalizedPageSize),
                pageSize: normalizedPageSize
            };
        });
    }
}
exports.AmazonS3StorageService = AmazonS3StorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTdG9yYWdlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hbWF6b24vYW1hem9uUzNTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsMkRBQXdEO0FBQ3hELHVEQUFvRDtBQUVwRDs7R0FFRztBQUNILE1BQWEsc0JBQXNCO0lBVy9COzs7O09BSUc7SUFDSCxZQUFZLE1BQTJCLEVBQUUsVUFBa0I7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNVLEdBQUcsQ0FBQyxFQUFVOztZQUN2QixNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFNUUsT0FBTyxlQUFlLENBQUMsT0FBTyxDQUFJLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRCxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsR0FBRyxDQUFDLEVBQVUsRUFBRSxJQUFPOztZQUNoQyxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFNUUsTUFBTSxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEQsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ1UsTUFBTSxDQUFDLEVBQVU7O1lBQzFCLE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUU1RSxNQUFNLGVBQWUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0UsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsSUFBSSxDQUFDLE9BQWdCLEVBQUUsSUFBc0IsRUFBRSxRQUEwQjs7WUFzQmxGLE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUU1RSxNQUFNLE9BQU8sR0FBRyxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFcEQsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsR0FBRywyQkFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUVsRyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUVwRCxPQUFPO2dCQUNILEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDckUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQzdDLFVBQVUsRUFBRSxPQUFPLENBQUMsTUFBTTtnQkFDMUIsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztnQkFDMUQsUUFBUSxFQUFFLGtCQUFrQjthQUMvQixDQUFDO1FBQ04sQ0FBQztLQUFBO0NBQ0o7QUFqR0Qsd0RBaUdDIn0=