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
var serviceFactory_1 = require("../../factories/serviceFactory");
/**
 * Service to handle the storage directly with management service.
 */
var DirectRegistrationService = /** @class */ (function () {
    /**
     * Create a new instance of DirectRegistrationService
     * @param registrationManagementServiceName The api configuration.
     */
    function DirectRegistrationService(registrationManagementServiceName) {
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
    DirectRegistrationService.prototype.register = function (registrationId, itemName, itemType, root, sideKey) {
        return __awaiter(this, void 0, void 0, function () {
            var registration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registration = {
                            id: registrationId,
                            created: Date.now(),
                            itemName: itemName,
                            itemType: itemType
                        };
                        return [4 /*yield*/, this._registrationManagementService.addRegistration(registration, root, sideKey)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                sideKey: registration.returnMamChannel && registration.returnMamChannel.sideKey,
                                root: registration.returnMamChannel && registration.returnMamChannel.initialRoot
                            }];
                }
            });
        });
    };
    /**
     * Remove a registration.
     * @param registrationId The registration id of the item.
     */
    DirectRegistrationService.prototype.unregister = function (registrationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._registrationManagementService.removeRegistration(registrationId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DirectRegistrationService;
}());
exports.DirectRegistrationService = DirectRegistrationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0UmVnaXN0cmF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9yZWdpc3RyYXRpb24vZGlyZWN0UmVnaXN0cmF0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWdFO0FBS2hFOztHQUVHO0FBQ0g7SUFNSTs7O09BR0c7SUFDSCxtQ0FBWSxpQ0FBeUM7UUFDakQsSUFBSSxDQUFDLDhCQUE4QjtZQUMvQiwrQkFBYyxDQUFDLEdBQUcsQ0FBaUMsaUNBQWlDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDVSw0Q0FBUSxHQUFyQixVQUNJLGNBQXNCLEVBQ3RCLFFBQWlCLEVBQ2pCLFFBQWlCLEVBQ2pCLElBQWEsRUFDYixPQUFnQjs7Ozs7O3dCQVlWLFlBQVksR0FBa0I7NEJBQ2hDLEVBQUUsRUFBRSxjQUFjOzRCQUNsQixPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTs0QkFDbkIsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLFFBQVEsRUFBRSxRQUFRO3lCQUNyQixDQUFDO3dCQUVGLHFCQUFNLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsRUFBQTs7d0JBQXRGLFNBQXNGLENBQUM7d0JBRXZGLHNCQUFPO2dDQUNILE9BQU8sRUFBRSxZQUFZLENBQUMsZ0JBQWdCLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU87Z0NBQy9FLElBQUksRUFBRSxZQUFZLENBQUMsZ0JBQWdCLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLFdBQVc7NkJBQ25GLEVBQUM7Ozs7S0FDTDtJQUVEOzs7T0FHRztJQUNVLDhDQUFVLEdBQXZCLFVBQXdCLGNBQXNCOzs7OzRCQUMxQyxxQkFBTSxJQUFJLENBQUMsOEJBQThCLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEVBQUE7O3dCQUE1RSxTQUE0RSxDQUFDOzs7OztLQUNoRjtJQUNMLGdDQUFDO0FBQUQsQ0FBQyxBQS9ERCxJQStEQztBQS9EWSw4REFBeUIifQ==