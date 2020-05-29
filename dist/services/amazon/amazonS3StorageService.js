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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNTdG9yYWdlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hbWF6b24vYW1hem9uUzNTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLDJEQUF3RDtBQUN4RCx1REFBb0Q7QUFFcEQ7O0dBRUc7QUFDSCxNQUFhLHNCQUFzQjtJQVcvQjs7OztPQUlHO0lBQ0gsWUFBWSxNQUEyQixFQUFFLFVBQWtCO1FBQ3ZELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsR0FBRyxDQUFDLEVBQVU7O1lBQ3ZCLE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUU1RSxPQUFPLGVBQWUsQ0FBQyxPQUFPLENBQUksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxHQUFHLENBQUMsRUFBVSxFQUFFLElBQU87O1lBQ2hDLE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUU1RSxNQUFNLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDVSxNQUFNLENBQUMsRUFBVTs7WUFDMUIsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTVFLE1BQU0sZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzRSxDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDVSxJQUFJLENBQUMsT0FBZ0IsRUFBRSxJQUFzQixFQUFFLFFBQTBCOztZQXNCbEYsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTVFLE1BQU0sT0FBTyxHQUFHLE1BQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVwRCxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLDJCQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRWxHLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXBELE9BQU87Z0JBQ0gsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDN0MsVUFBVSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUMxQixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDO2dCQUMxRCxRQUFRLEVBQUUsa0JBQWtCO2FBQy9CLENBQUM7UUFDTixDQUFDO0tBQUE7Q0FDSjtBQWxHRCx3REFrR0MifQ==