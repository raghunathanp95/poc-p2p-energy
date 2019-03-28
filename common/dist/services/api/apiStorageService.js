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
var storageApiClient_1 = require("./storageApiClient");
/**
 * Service to handle the storage using the storage api.
 */
var ApiStorageService = /** @class */ (function () {
    /**
     * Create a new instance of ApiStorageService
     * @param apiEndpoint The api configuration.
     * @param registrationId The registration id.
     * @param contextName The name of the context to store with.
     */
    function ApiStorageService(apiEndpoint, registrationId, contextName) {
        this._apiEndpoint = apiEndpoint;
        this._registrationId = registrationId;
        this._contextName = contextName;
    }
    /**
     * Get the item.
     * @param id The id of the item.
     */
    ApiStorageService.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var storageApiClient, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
                        return [4 /*yield*/, storageApiClient.storageGet({
                                registrationId: this._registrationId,
                                context: this._contextName,
                                id: id
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.item];
                }
            });
        });
    };
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    ApiStorageService.prototype.set = function (id, item) {
        return __awaiter(this, void 0, void 0, function () {
            var storageApiClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
                        return [4 /*yield*/, storageApiClient.storageSet({
                                registrationId: this._registrationId,
                                context: this._contextName,
                                id: id
                            }, item)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete the item.
     * @param item The item to store.
     */
    ApiStorageService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var storageApiClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
                        return [4 /*yield*/, storageApiClient.storageDelete({
                                registrationId: this._registrationId,
                                context: this._contextName,
                                id: id
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    ApiStorageService.prototype.page = function (context, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var storageApiClient, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageApiClient = new storageApiClient_1.StorageApiClient(this._apiEndpoint);
                        return [4 /*yield*/, storageApiClient.storageList({
                                registrationId: this._registrationId,
                                context: this._contextName,
                                page: page,
                                pageSize: pageSize
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                ids: response.ids || [],
                                items: response.items || [],
                                totalItems: response.totalItems || 0,
                                totalPages: response.totalPages || 0,
                                pageSize: response.pageSize || 0
                            }];
                }
            });
        });
    };
    return ApiStorageService;
}());
exports.ApiStorageService = ApiStorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvYXBpL2FwaVN0b3JhZ2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1REFBc0Q7QUFFdEQ7O0dBRUc7QUFDSDtJQWdCSTs7Ozs7T0FLRztJQUNILDJCQUFZLFdBQW1CLEVBQUUsY0FBc0IsRUFBRSxXQUFtQjtRQUN4RSxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsK0JBQUcsR0FBaEIsVUFBaUIsRUFBVTs7Ozs7O3dCQUNqQixnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFFaEQscUJBQU0sZ0JBQWdCLENBQUMsVUFBVSxDQUFJO2dDQUNsRCxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0NBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQ0FDMUIsRUFBRSxJQUFBOzZCQUNMLENBQUMsRUFBQTs7d0JBSkksUUFBUSxHQUFHLFNBSWY7d0JBRUYsc0JBQU8sUUFBUSxDQUFDLElBQUksRUFBQzs7OztLQUN4QjtJQUVEOzs7O09BSUc7SUFDVSwrQkFBRyxHQUFoQixVQUFpQixFQUFVLEVBQUUsSUFBTzs7Ozs7O3dCQUMxQixnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFFakUscUJBQU0sZ0JBQWdCLENBQUMsVUFBVSxDQUM3QjtnQ0FDSSxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0NBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQ0FDMUIsRUFBRSxFQUFFLEVBQUU7NkJBQ1QsRUFDRCxJQUFJLENBQUMsRUFBQTs7d0JBTlQsU0FNUyxDQUFDOzs7OztLQUNiO0lBRUQ7OztPQUdHO0lBQ1Usa0NBQU0sR0FBbkIsVUFBb0IsRUFBVTs7Ozs7O3dCQUNwQixnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFFakUscUJBQU0sZ0JBQWdCLENBQUMsYUFBYSxDQUNoQztnQ0FDSSxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0NBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQ0FDMUIsRUFBRSxJQUFBOzZCQUNMLENBQUMsRUFBQTs7d0JBTE4sU0FLTSxDQUFDOzs7OztLQUNWO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsZ0NBQUksR0FBakIsVUFBa0IsT0FBZ0IsRUFBRSxJQUFzQixFQUFFLFFBQTBCOzs7Ozs7d0JBc0I1RSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFFaEQscUJBQU0sZ0JBQWdCLENBQUMsV0FBVyxDQUMvQztnQ0FDSSxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0NBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQ0FDMUIsSUFBSSxNQUFBO2dDQUNKLFFBQVEsVUFBQTs2QkFDWCxDQUFDLEVBQUE7O3dCQU5BLFFBQVEsR0FBRyxTQU1YO3dCQUVOLHNCQUFPO2dDQUNILEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0NBQ3ZCLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0NBQzNCLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVSxJQUFJLENBQUM7Z0NBQ3BDLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVSxJQUFJLENBQUM7Z0NBQ3BDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxJQUFJLENBQUM7NkJBQ25DLEVBQUM7Ozs7S0FDTDtJQUNMLHdCQUFDO0FBQUQsQ0FBQyxBQTNIRCxJQTJIQztBQTNIWSw4Q0FBaUIifQ==