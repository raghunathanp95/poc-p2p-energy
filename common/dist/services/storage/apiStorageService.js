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
const storageApiClient_1 = require("../api/storageApiClient");
/**
 * Service to handle the storage using the storage api.
 */
class ApiStorageService {
    /**
     * Create a new instance of ApiStorageService
     * @param apiEndpoint The api configuration.
     * @param registrationId The registration id.
     * @param contextName The name of the context to store with.
     */
    constructor(apiEndpoint, registrationId, contextName) {
        this._apiEndpoint = apiEndpoint;
        this._registrationId = registrationId;
        this._contextName = contextName;
    }
    /**
     * Get the item.
     * @param id The id of the item.
     * @returns The item from the storage service.
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
            const response = yield storageApiClient.storageGet({
                registrationId: this._registrationId,
                context: this._contextName,
                id
            });
            return response.item;
        });
    }
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    set(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
            yield storageApiClient.storageSet({
                registrationId: this._registrationId,
                context: this._contextName,
                id: id
            }, item);
        });
    }
    /**
     * Delete the item.
     * @param id The id of the item to remove.
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
            yield storageApiClient.storageDelete({
                registrationId: this._registrationId,
                context: this._contextName,
                id
            });
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
            const storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
            const response = yield storageApiClient.storageList({
                registrationId: this._registrationId,
                context: this._contextName,
                page,
                pageSize
            });
            return {
                ids: response.ids || [],
                items: response.items || [],
                totalItems: response.totalItems || 0,
                totalPages: response.totalPages || 0,
                pageSize: response.pageSize || 0
            };
        });
    }
}
exports.ApiStorageService = ApiStorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc3RvcmFnZS9hcGlTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsOERBQTJEO0FBRTNEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFnQjFCOzs7OztPQUtHO0lBQ0gsWUFBWSxXQUFtQixFQUFFLGNBQXNCLEVBQUUsV0FBbUI7UUFDeEUsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxHQUFHLENBQUMsRUFBVTs7WUFDdkIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVqRSxNQUFNLFFBQVEsR0FBRyxNQUFNLGdCQUFnQixDQUFDLFVBQVUsQ0FBSTtnQkFDbEQsY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQzFCLEVBQUU7YUFDTCxDQUFDLENBQUM7WUFFSCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLEdBQUcsQ0FBQyxFQUFVLEVBQUUsSUFBTzs7WUFDaEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVqRSxNQUFNLGdCQUFnQixDQUFDLFVBQVUsQ0FDN0I7Z0JBQ0ksY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQzFCLEVBQUUsRUFBRSxFQUFFO2FBQ1QsRUFDRCxJQUFJLENBQUMsQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNVLE1BQU0sQ0FBQyxFQUFVOztZQUMxQixNQUFNLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWpFLE1BQU0sZ0JBQWdCLENBQUMsYUFBYSxDQUNoQztnQkFDSSxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0JBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDMUIsRUFBRTthQUNMLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNVLElBQUksQ0FBQyxPQUFnQixFQUFFLElBQXNCLEVBQUUsUUFBMEI7O1lBc0JsRixNQUFNLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWpFLE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsV0FBVyxDQUMvQztnQkFDSSxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0JBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDMUIsSUFBSTtnQkFDSixRQUFRO2FBQ1gsQ0FBQyxDQUFDO1lBRVAsT0FBTztnQkFDSCxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUN2QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUMzQixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsSUFBSSxDQUFDO2dCQUNwQyxVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsSUFBSSxDQUFDO2dCQUNwQyxRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDO2FBQ25DLENBQUM7UUFDTixDQUFDO0tBQUE7Q0FDSjtBQTVIRCw4Q0E0SEMifQ==