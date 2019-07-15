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
const serviceFactory_1 = require("../factories/serviceFactory");
const validationHelper_1 = require("../utils/validationHelper");
/**
 * Registration post command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
function registrationSet(config, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggingService = serviceFactory_1.ServiceFactory.get("logging");
        validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
        if (request.itemName) {
            validationHelper_1.ValidationHelper.string(request.itemName, "itemName");
        }
        if (request.itemType) {
            validationHelper_1.ValidationHelper.string(request.itemType, "itemType");
        }
        if (request.root) {
            validationHelper_1.ValidationHelper.trytes(request.root, 81, "root");
        }
        if (request.sideKey) {
            validationHelper_1.ValidationHelper.trytes(request.sideKey, 81, "sideKey");
        }
        const registrationManagementService = serviceFactory_1.ServiceFactory.get("registration-management");
        const registration = {
            id: request.registrationId,
            created: Date.now(),
            itemName: request.itemName,
            itemType: request.itemType
        };
        loggingService.log("registration", "Set", registration);
        yield registrationManagementService.addRegistration(registration, request.root, request.sideKey);
        return {
            success: true,
            message: "OK",
            sideKey: registration.returnMamChannel && registration.returnMamChannel.sideKey,
            root: registration.returnMamChannel && registration.returnMamChannel.initialRoot
        };
    });
}
exports.registrationSet = registrationSet;
/**
 * Registration delete command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
function registrationDelete(config, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggingService = serviceFactory_1.ServiceFactory.get("logging");
        validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
        validationHelper_1.ValidationHelper.trytes(request.sideKey, 81, "sideKey");
        loggingService.log("registration", "Delete", request.registrationId);
        const registrationManagementService = serviceFactory_1.ServiceFactory.get("registration-management");
        yield registrationManagementService.removeRegistration(request.registrationId, request.sideKey);
        const storageService = serviceFactory_1.ServiceFactory.get("storage");
        yield storageService.remove(`${request.registrationId}/`);
        return {
            success: true,
            message: "OK"
        };
    });
}
exports.registrationDelete = registrationDelete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uUm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9yZWdpc3RyYXRpb25Sb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGdFQUE2RDtBQVM3RCxnRUFBNkQ7QUFFN0Q7Ozs7O0dBS0c7QUFDSCxTQUFzQixlQUFlLENBQUMsTUFBVyxFQUFFLE9BQWdDOztRQUUvRSxNQUFNLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFFdEUsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ2xCLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ2xCLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2QsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ2pCLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMzRDtRQUVELE1BQU0sNkJBQTZCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlDLHlCQUF5QixDQUFDLENBQUM7UUFFcEgsTUFBTSxZQUFZLEdBQWtCO1lBQ2hDLEVBQUUsRUFBRSxPQUFPLENBQUMsY0FBYztZQUMxQixPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNuQixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDMUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1NBQzdCLENBQUM7UUFFRixjQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFeEQsTUFBTSw2QkFBNkIsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpHLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsSUFBSSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTztZQUMvRSxJQUFJLEVBQUUsWUFBWSxDQUFDLGdCQUFnQixJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXO1NBQ25GLENBQUM7SUFDTixDQUFDO0NBQUE7QUFyQ0QsMENBcUNDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFzQixrQkFBa0IsQ0FBQyxNQUFXLEVBQUUsT0FBbUM7O1FBQ3JGLE1BQU0sY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUV0RSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFeEQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyRSxNQUFNLDZCQUE2QixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFpQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXBILE1BQU0sNkJBQTZCLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEcsTUFBTSxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQTBCLFNBQVMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO1FBRTFELE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2hCLENBQUM7SUFDTixDQUFDO0NBQUE7QUFsQkQsZ0RBa0JDIn0=