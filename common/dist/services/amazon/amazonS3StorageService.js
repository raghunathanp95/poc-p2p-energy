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
     * @returns The object retrieved from the service.
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
     * @param id The id of the item to delete.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTdG9yYWdlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hbWF6b24vYW1hem9uUzNTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsMkRBQXdEO0FBQ3hELHVEQUFvRDtBQUVwRDs7R0FFRztBQUNILE1BQWEsc0JBQXNCO0lBVy9COzs7O09BSUc7SUFDSCxZQUFZLE1BQTJCLEVBQUUsVUFBa0I7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxHQUFHLENBQUMsRUFBVTs7WUFDdkIsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTVFLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBSSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEQsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLEdBQUcsQ0FBQyxFQUFVLEVBQUUsSUFBTzs7WUFDaEMsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTVFLE1BQU0sZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RELENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNVLE1BQU0sQ0FBQyxFQUFVOztZQUMxQixNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFNUUsTUFBTSxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNFLENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNVLElBQUksQ0FBQyxPQUFnQixFQUFFLElBQXNCLEVBQUUsUUFBMEI7O1lBc0JsRixNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFNUUsTUFBTSxPQUFPLEdBQUcsTUFBTSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXBELE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsMkJBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFbEcsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFcEQsT0FBTztnQkFDSCxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3JFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUM3QyxVQUFVLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQzFCLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUM7Z0JBQzFELFFBQVEsRUFBRSxrQkFBa0I7YUFDL0IsQ0FBQztRQUNOLENBQUM7S0FBQTtDQUNKO0FBbEdELHdEQWtHQyJ9