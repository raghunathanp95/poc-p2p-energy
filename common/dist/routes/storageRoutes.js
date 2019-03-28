"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var serviceFactory_1 = require("../factories/serviceFactory");
var pathHelper_1 = require("../utils/pathHelper");
var validationHelper_1 = require("../utils/validationHelper");
/**
 * Storage get command.
 */
function storageGet(config, request) {
    return __awaiter(this, void 0, void 0, function () {
        var loggingService, registrationService, item, storageService, path, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggingService = serviceFactory_1.ServiceFactory.get("logging");
                    validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
                    validationHelper_1.ValidationHelper.string(request.context, "context");
                    validationHelper_1.ValidationHelper.string(request.id, "id");
                    registrationService = serviceFactory_1.ServiceFactory.get("registration-storage");
                    return [4 /*yield*/, registrationService.get(request.registrationId)];
                case 1:
                    item = _a.sent();
                    if (!item) {
                        throw new Error("Registration '" + request.registrationId + "' does not exist.");
                    }
                    storageService = serviceFactory_1.ServiceFactory.get("storage");
                    path = pathHelper_1.PathHelper.join(request.registrationId, request.context, request.id);
                    return [4 /*yield*/, storageService.get(path)];
                case 2:
                    data = _a.sent();
                    loggingService.log("storage", "Get", path, data);
                    return [2 /*return*/, {
                            success: true,
                            message: "OK",
                            item: data
                        }];
            }
        });
    });
}
exports.storageGet = storageGet;
/**
 * Storage set command.
 */
function storageSet(config, request, body) {
    return __awaiter(this, void 0, void 0, function () {
        var loggingService, registrationService, item, storageService, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggingService = serviceFactory_1.ServiceFactory.get("logging");
                    validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
                    validationHelper_1.ValidationHelper.string(request.context, "context");
                    validationHelper_1.ValidationHelper.string(request.id, "id");
                    registrationService = serviceFactory_1.ServiceFactory.get("registration-storage");
                    return [4 /*yield*/, registrationService.get(request.registrationId)];
                case 1:
                    item = _a.sent();
                    if (!item) {
                        throw new Error("Registration '" + request.registrationId + "' does not exist.");
                    }
                    storageService = serviceFactory_1.ServiceFactory.get("storage");
                    path = pathHelper_1.PathHelper.join(request.registrationId, request.context, request.id);
                    loggingService.log("storage", "Set", path, body);
                    return [4 /*yield*/, storageService.set(path, body)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: "OK"
                        }];
            }
        });
    });
}
exports.storageSet = storageSet;
/**
 * Storage delete command.
 */
function storageDelete(config, request) {
    return __awaiter(this, void 0, void 0, function () {
        var loggingService, registrationService, item, storageService, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggingService = serviceFactory_1.ServiceFactory.get("logging");
                    validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
                    if (request.context) {
                        validationHelper_1.ValidationHelper.string(request.context, "context");
                    }
                    if (request.id) {
                        validationHelper_1.ValidationHelper.string(request.id, "id");
                    }
                    registrationService = serviceFactory_1.ServiceFactory.get("registration-storage");
                    return [4 /*yield*/, registrationService.get(request.registrationId)];
                case 1:
                    item = _a.sent();
                    if (!item) {
                        throw new Error("Registration '" + request.registrationId + "' does not exist.");
                    }
                    storageService = serviceFactory_1.ServiceFactory.get("storage");
                    path = pathHelper_1.PathHelper.join(request.registrationId, request.context, request.id);
                    loggingService.log("storage", "Delete", path);
                    return [4 /*yield*/, storageService.remove(path)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: "OK"
                        }];
            }
        });
    });
}
exports.storageDelete = storageDelete;
/**
 * Storage list command.
 */
function storageList(config, request) {
    return __awaiter(this, void 0, void 0, function () {
        var loggingService, registrationService, item, storageService, path, itemsAndIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggingService = serviceFactory_1.ServiceFactory.get("logging");
                    validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
                    validationHelper_1.ValidationHelper.string(request.context, "context");
                    registrationService = serviceFactory_1.ServiceFactory.get("registration-storage");
                    return [4 /*yield*/, registrationService.get(request.registrationId)];
                case 1:
                    item = _a.sent();
                    if (!item) {
                        throw new Error("Registration '" + request.registrationId + "' does not exist.");
                    }
                    storageService = serviceFactory_1.ServiceFactory.get("storage");
                    path = pathHelper_1.PathHelper.join(request.registrationId, request.context);
                    return [4 /*yield*/, storageService.page(path, request.page, request.pageSize)];
                case 2:
                    itemsAndIds = _a.sent();
                    loggingService.log("storage", "List", path, itemsAndIds);
                    return [2 /*return*/, {
                            success: true,
                            message: "OK",
                            ids: itemsAndIds.ids,
                            items: itemsAndIds.items,
                            totalItems: itemsAndIds.totalItems,
                            totalPages: itemsAndIds.totalPages,
                            pageSize: itemsAndIds.pageSize
                        }];
            }
        });
    });
}
exports.storageList = storageList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZVJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvc3RvcmFnZVJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQTZEO0FBVzdELGtEQUFpRDtBQUNqRCw4REFBNkQ7QUFFN0Q7O0dBRUc7QUFDSCxTQUFzQixVQUFVLENBQUMsTUFBVyxFQUFFLE9BQTJCOzs7Ozs7b0JBQy9ELGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7b0JBRXRFLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNyRSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDcEQsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRXBDLG1CQUFtQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFpQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUMxRixxQkFBTSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFBOztvQkFBNUQsSUFBSSxHQUFHLFNBQXFEO29CQUNsRSxJQUFJLENBQUMsSUFBSSxFQUFFO3dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLE9BQU8sQ0FBQyxjQUFjLHNCQUFtQixDQUFDLENBQUM7cUJBQy9FO29CQUVLLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIsU0FBUyxDQUFDLENBQUM7b0JBRXJFLElBQUksR0FBRyx1QkFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUs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