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
const serviceFactory_1 = require("../../factories/serviceFactory");
/**
 * Service to handle the storage directly with management service.
 */
class DirectRegistrationService {
    /**
     * Create a new instance of DirectRegistrationService
     * @param registrationManagementServiceName The api configuration.
     */
    constructor(registrationManagementServiceName) {
        this._registrationManagementService =
            serviceFactory_1.ServiceFactory.get(registrationManagementServiceName);
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
            const registration = {
                id: registrationId,
                created: Date.now(),
                itemName: itemName,
                itemType: itemType
            };
            yield this._registrationManagementService.addRegistration(registration, root, sideKey);
            return {
                sideKey: registration.returnMamChannel && registration.returnMamChannel.sideKey,
                root: registration.returnMamChannel && registration.returnMamChannel.initialRoot
            };
        });
    }
    /**
     * Remove a registration.
     * @param registrationId The registration id of the item.
     * @param sideKey The client mam channel side key used for remove validation.
     */
    unregister(registrationId, sideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._registrationManagementService.removeRegistration(registrationId, sideKey);
        });
    }
}
exports.DirectRegistrationService = DirectRegistrationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0UmVnaXN0cmF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9yZWdpc3RyYXRpb24vZGlyZWN0UmVnaXN0cmF0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsbUVBQWdFO0FBS2hFOztHQUVHO0FBQ0gsTUFBYSx5QkFBeUI7SUFNbEM7OztPQUdHO0lBQ0gsWUFBWSxpQ0FBeUM7UUFDakQsSUFBSSxDQUFDLDhCQUE4QjtZQUMvQiwrQkFBYyxDQUFDLEdBQUcsQ0FBaUMsaUNBQWlDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDVSxRQUFRLENBQ2pCLGNBQXNCLEVBQ3RCLFFBQWlCLEVBQ2pCLFFBQWlCLEVBQ2pCLElBQWEsRUFDYixPQUFnQjs7WUFZaEIsTUFBTSxZQUFZLEdBQWtCO2dCQUNoQyxFQUFFLEVBQUUsY0FBYztnQkFDbEIsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ25CLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTthQUNyQixDQUFDO1lBRUYsTUFBTSxJQUFJLENBQUMsOEJBQThCLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFdkYsT0FBTztnQkFDSCxPQUFPLEVBQUUsWUFBWSxDQUFDLGdCQUFnQixJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPO2dCQUMvRSxJQUFJLEVBQUUsWUFBWSxDQUFDLGdCQUFnQixJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXO2FBQ25GLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsVUFBVSxDQUFDLGNBQXNCLEVBQUUsT0FBZTs7WUFDM0QsTUFBTSxJQUFJLENBQUMsOEJBQThCLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFGLENBQUM7S0FBQTtDQUNKO0FBaEVELDhEQWdFQyJ9