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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uUm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9yZWdpc3RyYXRpb25Sb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFTN0QsZ0VBQTZEO0FBRTdEOzs7OztHQUtHO0FBQ0gsU0FBc0IsZUFBZSxDQUFDLE1BQVcsRUFBRSxPQUFnQzs7UUFFL0UsTUFBTSxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBRXRFLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNsQixtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUN6RDtRQUNELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNsQixtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUN6RDtRQUNELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtZQUNkLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyRDtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNqQixtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDM0Q7UUFFRCxNQUFNLDZCQUE2QixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFpQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXBILE1BQU0sWUFBWSxHQUFrQjtZQUNoQyxFQUFFLEVBQUUsT0FBTyxDQUFDLGNBQWM7WUFDMUIsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDbkIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzFCLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtTQUM3QixDQUFDO1FBRUYsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRXhELE1BQU0sNkJBQTZCLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqRyxPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSxZQUFZLENBQUMsZ0JBQWdCLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU87WUFDL0UsSUFBSSxFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsSUFBSSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsV0FBVztTQUNuRixDQUFDO0lBQ04sQ0FBQztDQUFBO0FBckNELDBDQXFDQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBc0Isa0JBQWtCLENBQUMsTUFBVyxFQUFFLE9BQW1DOztRQUNyRixNQUFNLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFFdEUsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckUsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXhELGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckUsTUFBTSw2QkFBNkIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBaUMseUJBQXlCLENBQUMsQ0FBQztRQUVwSCxNQUFNLDZCQUE2QixDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhHLE1BQU0sY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUEwQixTQUFTLENBQUMsQ0FBQztRQUM5RSxNQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztRQUUxRCxPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNoQixDQUFDO0lBQ04sQ0FBQztDQUFBO0FBbEJELGdEQWtCQyJ9