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
var storageApiClient_1 = require("../api/storageApiClient");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc3RvcmFnZS9hcGlTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNERBQTJEO0FBRTNEOztHQUVHO0FBQ0g7SUFnQkk7Ozs7O09BS0c7SUFDSCwyQkFBWSxXQUFtQixFQUFFLGNBQXNCLEVBQUUsV0FBbUI7UUFDeEUsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7T0FHRztJQUNVLCtCQUFHLEdBQWhCLFVBQWlCLEVBQVU7Ozs7Ozt3QkFDakIsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBRWhELHFCQUFNLGdCQUFnQixDQUFDLFVBQVUsQ0FBSTtnQ0FDbEQsY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dDQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0NBQzFCLEVBQUUsSUFBQTs2QkFDTCxDQUFDLEVBQUE7O3dCQUpJLFFBQVEsR0FBRyxTQUlmO3dCQUVGLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUM7Ozs7S0FDeEI7SUFFRDs7OztPQUlHO0lBQ1UsK0JBQUcsR0FBaEIsVUFBaUIsRUFBVSxFQUFFLElBQU87Ozs7Ozt3QkFDMUIsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBRWpFLHFCQUFNLGdCQUFnQixDQUFDLFVBQVUsQ0FDN0I7Z0NBQ0ksY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dDQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0NBQzFCLEVBQUUsRUFBRSxFQUFFOzZCQUNULEVBQ0QsSUFBSSxDQUFDLEVBQUE7O3dCQU5ULFNBTVMsQ0FBQzs7Ozs7S0FDYjtJQUVEOzs7T0FHRztJQUNVLGtDQUFNLEdBQW5CLFVBQW9CLEVBQVU7Ozs7Ozt3QkFDcEIsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBRWpFLHFCQUFNLGdCQUFnQixDQUFDLGFBQWEsQ0FDaEM7Z0NBQ0ksY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dDQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0NBQzFCLEVBQUUsSUFBQTs2QkFDTCxDQUFDLEVBQUE7O3dCQUxOLFNBS00sQ0FBQzs7Ozs7S0FDVjtJQUVEOzs7Ozs7T0FNRztJQUNVLGdDQUFJLEdBQWpCLFVBQWtCLE9BQWdCLEVBQUUsSUFBc0IsRUFBRSxRQUEwQjs7Ozs7O3dCQXNCNUUsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBRWhELHFCQUFNLGdCQUFnQixDQUFDLFdBQVcsQ0FDL0M7Z0NBQ0ksY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlO2dDQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0NBQzFCLElBQUksTUFBQTtnQ0FDSixRQUFRLFVBQUE7NkJBQ1gsQ0FBQyxFQUFBOzt3QkFOQSxRQUFRLEdBQUcsU0FNWDt3QkFFTixzQkFBTztnQ0FDSCxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBSSxFQUFFO2dDQUN2QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO2dDQUMzQixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsSUFBSSxDQUFDO2dDQUNwQyxVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsSUFBSSxDQUFDO2dDQUNwQyxRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDOzZCQUNuQyxFQUFDOzs7O0tBQ0w7SUFDTCx3QkFBQztBQUFELENBQUMsQUEzSEQsSUEySEM7QUEzSFksOENBQWlCIn0=