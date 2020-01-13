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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc3RvcmFnZS9hcGlTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLDhEQUEyRDtBQUUzRDs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBZ0IxQjs7Ozs7T0FLRztJQUNILFlBQVksV0FBbUIsRUFBRSxjQUFzQixFQUFFLFdBQW1CO1FBQ3hFLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsR0FBRyxDQUFDLEVBQVU7O1lBQ3ZCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFakUsTUFBTSxRQUFRLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUk7Z0JBQ2xELGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZTtnQkFDcEMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMxQixFQUFFO2FBQ0wsQ0FBQyxDQUFDO1lBRUgsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxHQUFHLENBQUMsRUFBVSxFQUFFLElBQU87O1lBQ2hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFakUsTUFBTSxnQkFBZ0IsQ0FBQyxVQUFVLENBQzdCO2dCQUNJLGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZTtnQkFDcEMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMxQixFQUFFLEVBQUUsRUFBRTthQUNULEVBQ0QsSUFBSSxDQUFDLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDVSxNQUFNLENBQUMsRUFBVTs7WUFDMUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVqRSxNQUFNLGdCQUFnQixDQUFDLGFBQWEsQ0FDaEM7Z0JBQ0ksY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQzFCLEVBQUU7YUFDTCxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDVSxJQUFJLENBQUMsT0FBZ0IsRUFBRSxJQUFzQixFQUFFLFFBQTBCOztZQXNCbEYsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVqRSxNQUFNLFFBQVEsR0FBRyxNQUFNLGdCQUFnQixDQUFDLFdBQVcsQ0FDL0M7Z0JBQ0ksY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQzFCLElBQUk7Z0JBQ0osUUFBUTthQUNYLENBQUMsQ0FBQztZQUVQLE9BQU87Z0JBQ0gsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksRUFBRTtnQkFDdkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDM0IsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVLElBQUksQ0FBQztnQkFDcEMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVLElBQUksQ0FBQztnQkFDcEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FBQzthQUNuQyxDQUFDO1FBQ04sQ0FBQztLQUFBO0NBQ0o7QUE1SEQsOENBNEhDIn0=