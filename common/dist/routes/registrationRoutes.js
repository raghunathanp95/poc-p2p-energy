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
var validationHelper_1 = require("../utils/validationHelper");
/**
 * Registration post command.
 */
function registrationSet(config, request) {
    return __awaiter(this, void 0, void 0, function () {
        var loggingService, registrationService, registration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggingService = serviceFactory_1.ServiceFactory.get("logging");
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
                    registrationService = serviceFactory_1.ServiceFactory.get("registration-management");
                    registration = {
                        id: request.registrationId,
                        created: Date.now(),
                        itemName: request.itemName,
                        itemType: request.itemType
                    };
                    loggingService.log("registration", "Set", registration);
                    return [4 /*yield*/, registrationService.addRegistration(registration, request.root, request.sideKey)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: "OK",
                            sideKey: registration.returnMamChannel && registration.returnMamChannel.sideKey,
                            root: registration.returnMamChannel && registration.returnMamChannel.initialRoot
                        }];
            }
        });
    });
}
exports.registrationSet = registrationSet;
/**
 * Registration delete command.
 */
function registrationDelete(config, request) {
    return __awaiter(this, void 0, void 0, function () {
        var loggingService, registrationService, storageService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggingService = serviceFactory_1.ServiceFactory.get("logging");
                    validationHelper_1.ValidationHelper.string(request.registrationId, "registrationId", 8);
                    loggingService.log("registration", "Delete", request.registrationId);
                    registrationService = serviceFactory_1.ServiceFactory.get("registration-management");
                    return [4 /*yield*/, registrationService.removeRegistration(request.registrationId)];
                case 1:
                    _a.sent();
                    storageService = serviceFactory_1.ServiceFactory.get("storage");
                    return [4 /*yield*/, storageService.remove(request.registrationId + "/")];
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
exports.registrationDelete = registrationDelete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uUm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9yZWdpc3RyYXRpb25Sb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQUE2RDtBQVM3RCw4REFBNkQ7QUFFN0Q7O0dBRUc7QUFDSCxTQUFzQixlQUFlLENBQUMsTUFBVyxFQUFFLE9BQWdDOzs7Ozs7b0JBRXpFLGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7b0JBRXRFLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNyRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7d0JBQ2xCLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3FCQUN6RDtvQkFDRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7d0JBQ2xCLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3FCQUN6RDtvQkFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7d0JBQ2QsbUNBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUNyRDtvQkFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7d0JBQ2pCLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztxQkFDM0Q7b0JBRUssbUJBQW1CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlDLHlCQUF5QixDQUFDLENBQUM7b0JBRXBHLFlBQVksR0FBa0I7d0JBQ2hDLEVBQUUsRUFBRSxPQUFPLENBQUMsY0FBYzt3QkFDMUIsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ25CLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTt3QkFDMUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO3FCQUM3QixDQUFDO29CQUVGLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFFeEQscUJBQU0sbUJBQW1CLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBQTs7b0JBQXRGLFNBQXNGLENBQUM7b0JBRXZGLHNCQUFPOzRCQUNILE9BQU8sRUFBRSxJQUFJOzRCQUNiLE9BQU8sRUFBRSxJQUFJOzRCQUNiLE9BQU8sRUFBRSxZQUFZLENBQUMsZ0JBQWdCLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU87NEJBQy9FLElBQUksRUFBRSxZQUFZLENBQUMsZ0JBQWdCLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLFdBQVc7eUJBQ25GLEVBQUM7Ozs7Q0FDTDtBQXJDRCwwQ0FxQ0M7QUFFRDs7R0FFRztBQUNILFNBQXNCLGtCQUFrQixDQUFDLE1BQVcsRUFBRSxPQUFtQzs7Ozs7O29CQUMvRSxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO29CQUV0RSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFckUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDL0QsbUJBQW1CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlDLHlCQUF5QixDQUFDLENBQUM7b0JBRTFHLHFCQUFNLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBQTs7b0JBQXBFLFNBQW9FLENBQUM7b0JBRS9ELGNBQWMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBMEIsU0FBUyxDQUFDLENBQUM7b0JBQzlFLHFCQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUksT0FBTyxDQUFDLGNBQWMsTUFBRyxDQUFDLEVBQUE7O29CQUF6RCxTQUF5RCxDQUFDO29CQUUxRCxzQkFBTzs0QkFDSCxPQUFPLEVBQUUsSUFBSTs0QkFDYixPQUFPLEVBQUUsSUFBSTt5QkFDaEIsRUFBQzs7OztDQUNMO0FBakJELGdEQWlCQyJ9