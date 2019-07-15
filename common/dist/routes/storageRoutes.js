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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZVJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvc3RvcmFnZVJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVzdELG9EQUFpRDtBQUNqRCxnRUFBNkQ7QUFFN0Q7Ozs7O0dBS0c7QUFDSCxTQUFzQixVQUFVLENBQUMsTUFBVyxFQUFFLE9BQTJCOztRQUNyRSxNQUFNLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFFdEUsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckUsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEQsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFMUMsTUFBTSwwQkFBMEIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBaUMsc0JBQXNCLENBQUMsQ0FBQztRQUM5RyxNQUFNLElBQUksR0FBRyxNQUFNLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLE9BQU8sQ0FBQyxjQUFjLG1CQUFtQixDQUFDLENBQUM7U0FDL0U7UUFFRCxNQUFNLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIsU0FBUyxDQUFDLENBQUM7UUFFM0UsTUFBTSxJQUFJLEdBQUcsdUJBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVsRixNQUFNLElBQUksR0FB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