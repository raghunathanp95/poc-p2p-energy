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
const registrationApiClient_1 = require("../api/registrationApiClient");
/**
 * Service to handle the storage using the storage api.
 */
class ApiRegistrationService {
    /**
     * Create a new instance of ApiRegistrationService
     * @param apiEndpoint The api configuration.
     */
    constructor(apiEndpoint) {
        this._apiEndpoint = apiEndpoint;
    }
    /**
     * Create a new registration.
     * @param registrationId The registration id of the item.
     * @param itemName Name of the item.
     * @param itemType The type of the item.
     * @param root The initial root for the mam channel.
     * @param sideKey The private key for the mam channel.
     * @returns The response from the request.
     */
    register(registrationId, itemName, itemType, root, sideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationApiClient = new registrationApiClient_1.RegistrationApiClient(this._apiEndpoint);
            return registrationApiClient.registrationSet({ registrationId, itemName, itemType, root, sideKey });
        });
    }
    /**
     * Remove a registration.
     * @param registrationId The registration id of the item.
     * @param sideKey The client mam channel side key used for remove validation.
     */
    unregister(registrationId, sideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationApiClient = new registrationApiClient_1.RegistrationApiClient(this._apiEndpoint);
            yield registrationApiClient.registrationDelete({ registrationId, sideKey });
        });
    }
}
exports.ApiRegistrationService = ApiRegistrationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpUmVnaXN0cmF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9yZWdpc3RyYXRpb24vYXBpUmVnaXN0cmF0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLHdFQUFxRTtBQUVyRTs7R0FFRztBQUNILE1BQWEsc0JBQXNCO0lBTS9COzs7T0FHRztJQUNILFlBQVksV0FBbUI7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ1UsUUFBUSxDQUNqQixjQUFzQixFQUN0QixRQUFpQixFQUNqQixRQUFpQixFQUNqQixJQUFhLEVBQ2IsT0FBZ0I7O1lBV2hCLE1BQU0scUJBQXFCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFM0UsT0FBTyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN4RyxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsVUFBVSxDQUFDLGNBQXNCLEVBQUUsT0FBZTs7WUFDM0QsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUzRSxNQUFNLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDaEYsQ0FBQztLQUFBO0NBQ0o7QUF0REQsd0RBc0RDIn0=