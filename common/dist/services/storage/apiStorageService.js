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
     * @param item The item to store.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc3RvcmFnZS9hcGlTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsOERBQTJEO0FBRTNEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFnQjFCOzs7OztPQUtHO0lBQ0gsWUFBWSxXQUFtQixFQUFFLGNBQXNCLEVBQUUsV0FBbUI7UUFDeEUsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7T0FHRztJQUNVLEdBQUcsQ0FBQyxFQUFVOztZQUN2QixNQUFNLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWpFLE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsVUFBVSxDQUFJO2dCQUNsRCxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0JBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDMUIsRUFBRTthQUNMLENBQUMsQ0FBQztZQUVILE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsR0FBRyxDQUFDLEVBQVUsRUFBRSxJQUFPOztZQUNoQyxNQUFNLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWpFLE1BQU0sZ0JBQWdCLENBQUMsVUFBVSxDQUM3QjtnQkFDSSxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0JBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDMUIsRUFBRSxFQUFFLEVBQUU7YUFDVCxFQUNELElBQUksQ0FBQyxDQUFDO1FBQ2QsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ1UsTUFBTSxDQUFDLEVBQVU7O1lBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFakUsTUFBTSxnQkFBZ0IsQ0FBQyxhQUFhLENBQ2hDO2dCQUNJLGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZTtnQkFDcEMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMxQixFQUFFO2FBQ0wsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsSUFBSSxDQUFDLE9BQWdCLEVBQUUsSUFBc0IsRUFBRSxRQUEwQjs7WUFzQmxGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFakUsTUFBTSxRQUFRLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxXQUFXLENBQy9DO2dCQUNJLGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZTtnQkFDcEMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMxQixJQUFJO2dCQUNKLFFBQVE7YUFDWCxDQUFDLENBQUM7WUFFUCxPQUFPO2dCQUNILEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQ3ZCLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQzNCLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVSxJQUFJLENBQUM7Z0JBQ3BDLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVSxJQUFJLENBQUM7Z0JBQ3BDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxJQUFJLENBQUM7YUFDbkMsQ0FBQztRQUNOLENBQUM7S0FBQTtDQUNKO0FBM0hELDhDQTJIQyJ9