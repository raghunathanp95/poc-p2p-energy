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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZVJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvc3RvcmFnZVJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVzdELG9EQUFpRDtBQUNqRCxnRUFBNkQ7QUFFN0Q7O0dBRUc7QUFDSCxTQUFzQixVQUFVLENBQUMsTUFBVyxFQUFFLE9BQTJCOztRQUNyRSxNQUFNLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFFdEUsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckUsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEQsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFMUMsTUFBTSwwQkFBMEIsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBaUMsc0JBQXNCLENBQUMsQ0FBQztRQUM5RyxNQUFNLElBQUksR0FBRyxNQUFNLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLE9BQU8sQ0FBQyxjQUFjLG1CQUFtQixDQUFDLENBQUM7U0FDL0U7UUFFRCxNQUFNLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIsU0FBUyxDQUFDLENBQUM7UUFFM0UsTUFBTSxJQUFJLEdBQUcsdUJBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVsRixNQUFNLElBQUksR0FBRyxN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