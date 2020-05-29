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
const pathHelper_1 = require("../utils/pathHelper");
const validationHelper_1 = require("../utils/validationHelper");
/**
 * Storage get command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
function storageGet(config, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggingService = serviceFactory_1.ServiceFactory.get("logging");
        validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
        validationHelper_1.ValidationHelper.string(request.context, "context");
        validationHelper_1.ValidationHelper.string(request.id, "id");
        const registrationStorageService = serviceFactory_1.ServiceFactory.get("registration-storage");
        const item = yield registrationStorageService.get(request.registrationId);
        if (!item) {
            throw new Error(`Registration '${request.registrationId}' does not exist.`);
        }
        const storageService = serviceFactory_1.ServiceFactory.get("storage");
        const path = pathHelper_1.PathHelper.join(request.registrationId, request.context, request.id);
        const data = yield storageService.get(path);
        loggingService.log("storage", "Get", path, data);
        return {
            success: true,
            message: "OK",
            item: data
        };
    });
}
exports.storageGet = storageGet;
/**
 * Storage set command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @param body The body of the object to store.
 * @returns The route response.
 */
function storageSet(config, request, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggingService = serviceFactory_1.ServiceFactory.get("logging");
        validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
        validationHelper_1.ValidationHelper.string(request.context, "context");
        validationHelper_1.ValidationHelper.string(request.id, "id");
        const registrationStorageService = serviceFactory_1.ServiceFactory.get("registration-storage");
        const item = yield registrationStorageService.get(request.registrationId);
        if (!item) {
            throw new Error(`Registration '${request.registrationId}' does not exist.`);
        }
        const storageService = serviceFactory_1.ServiceFactory.get("storage");
        const path = pathHelper_1.PathHelper.join(request.registrationId, request.context, request.id);
        loggingService.log("storage", "Set", path, body);
        yield storageService.set(path, body);
        return {
            success: true,
            message: "OK"
        };
    });
}
exports.storageSet = storageSet;
/**
 * Storage delete command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
function storageDelete(config, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggingService = serviceFactory_1.ServiceFactory.get("logging");
        validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
        if (request.context) {
            validationHelper_1.ValidationHelper.string(request.context, "context");
        }
        if (request.id) {
            validationHelper_1.ValidationHelper.string(request.id, "id");
        }
        const registrationStorageService = serviceFactory_1.ServiceFactory.get("registration-storage");
        const item = yield registrationStorageService.get(request.registrationId);
        if (!item) {
            throw new Error(`Registration '${request.registrationId}' does not exist.`);
        }
        const storageService = serviceFactory_1.ServiceFactory.get("storage");
        const path = pathHelper_1.PathHelper.join(request.registrationId, request.context, request.id);
        loggingService.log("storage", "Delete", path);
        yield storageService.remove(path);
        return {
            success: true,
            message: "OK"
        };
    });
}
exports.storageDelete = storageDelete;
/**
 * Storage list command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
function storageList(config, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggingService = serviceFactory_1.ServiceFactory.get("logging");
        validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
        validationHelper_1.ValidationHelper.string(request.context, "context");
        const registrationStorageService = serviceFactory_1.ServiceFactory.get("registration-storage");
        const item = yield registrationStorageService.get(request.registrationId);
        if (!item) {
            throw new Error(`Registration '${request.registrationId}' does not exist.`);
        }
        const storageService = serviceFactory_1.ServiceFactory.get("storage");
        const path = pathHelper_1.PathHelper.join(request.registrationId, request.context);
        const itemsAndIds = yield storageService.page(path, request.page, request.pageSize);
        loggingService.log("storage", "List", path, itemsAndIds);
        return {
            success: true,
            message: "OK",
            ids: itemsAndIds.ids,
            items: itemsAndIds.items,
            totalItems: itemsAndIds.totalItems,
            totalPages: itemsAndIds.totalPages,
            pageSize: itemsAndIds.pageSize
        };
    });
}
exports.storageList = storageList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZVJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvc3RvcmFnZVJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGdFQUE2RDtBQVc3RCxvREFBaUQ7QUFDakQsZ0VBQTZEO0FBRTdEOzs7OztHQUtHO0FBQ0gsU0FBc0IsVUFBVSxDQUFDLE1BQVcsRUFBRSxPQUEyQjs7UUFDckUsTUFBTSxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBRXRFLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTFDLE1BQU0sMEJBQTBCLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlDLHNCQUFzQixDQUFDLENBQUM7UUFDOUcsTUFBTSxJQUFJLEdBQUcsTUFBTSwwQkFBMEIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixPQUFPLENBQUMsY0FBYyxtQkFBbUIsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsTUFBTSxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQXVCLFNBQVMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sSUFBSSxHQUFHLHVCQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbEYsTUFBTSxJQUFJLEdB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