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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0UmVnaXN0cmF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9yZWdpc3RyYXRpb24vZGlyZWN0UmVnaXN0cmF0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1FQUFnRTtBQUtoRTs7R0FFRztBQUNILE1BQWEseUJBQXlCO0lBTWxDOzs7T0FHRztJQUNILFlBQVksaUNBQXlDO1FBQ2pELElBQUksQ0FBQyw4QkFBOEI7WUFDL0IsK0JBQWMsQ0FBQyxHQUFHLENBQWlDLGlDQUFpQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ1UsUUFBUSxDQUNqQixjQUFzQixFQUN0QixRQUFpQixFQUNqQixRQUFpQixFQUNqQixJQUFhLEVBQ2IsT0FBZ0I7O1lBWWhCLE1BQU0sWUFBWSxHQUFrQjtnQkFDaEMsRUFBRSxFQUFFLGNBQWM7Z0JBQ2xCLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNuQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7YUFDckIsQ0FBQztZQUVGLE1BQU0sSUFBSSxDQUFDLDhCQUE4QixDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXZGLE9BQU87Z0JBQ0gsT0FBTyxFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsSUFBSSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTztnQkFDL0UsSUFBSSxFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsSUFBSSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsV0FBVzthQUNuRixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLFVBQVUsQ0FBQyxjQUFzQixFQUFFLE9BQWU7O1lBQzNELE1BQU0sSUFBSSxDQUFDLDhCQUE4QixDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRixDQUFDO0tBQUE7Q0FDSjtBQWhFRCw4REFnRUMifQ==