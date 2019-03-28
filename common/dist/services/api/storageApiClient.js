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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var apiHelper_1 = require("../../utils/apiHelper");
/**
 * Class to handle storage api communications.
 */
var StorageApiClient = /** @class */ (function () {
    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    function StorageApiClient(endpoint) {
        this._endpoint = endpoint;
    }
    /**
     * Store something with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    StorageApiClient.prototype.storageSet = function (request, data) {
        return __awaiter(this, void 0, void 0, function () {
            var ax, response, axiosResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ax = axios_1.default.create({ baseURL: this._endpoint });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ax.put(apiHelper_1.ApiHelper.joinParams("storage", [request.registrationId, request.context, request.id]), data)];
                    case 2:
                        axiosResponse = _a.sent();
                        response = axiosResponse.data;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        response = {
                            success: false,
                            message: "There was a problem communicating with the API.\n" + err_1
                        };
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Get something stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    StorageApiClient.prototype.storageGet = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var ax, response, axiosResponse, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ax = axios_1.default.create({ baseURL: this._endpoint });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ax.get(apiHelper_1.ApiHelper.joinParams("storage", [request.registrationId, request.context, request.id]))];
                    case 2:
                        axiosResponse = _a.sent();
                        response = axiosResponse.data;
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        response = {
                            success: false,
                            message: "There was a problem communicating with the API.\n" + err_2
                        };
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Delete something stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    StorageApiClient.prototype.storageDelete = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var ax, response, axiosResponse, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ax = axios_1.default.create({ baseURL: this._endpoint });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ax.delete(apiHelper_1.ApiHelper.joinParams("storage", [request.registrationId, request.context, request.id]))];
                    case 2:
                        axiosResponse = _a.sent();
                        response = axiosResponse.data;
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        response = {
                            success: false,
                            message: "There was a problem communicating with the API.\n" + err_3
                        };
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * List items stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    StorageApiClient.prototype.storageList = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var ax, response, axiosResponse, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ax = axios_1.default.create({ baseURL: this._endpoint });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ax.get(apiHelper_1.ApiHelper.joinParams("storage", [request.registrationId, request.context]), {
                                params: apiHelper_1.ApiHelper.removeKeys(request, ["registrationId", "context"])
                            })];
                    case 2:
                        axiosResponse = _a.sent();
                        response = axiosResponse.data;
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        response = {
                            success: false,
                            message: "There was a problem communicating with the API.\n" + err_4
                        };
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    return StorageApiClient;
}());
exports.StorageApiClient = StorageApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZUFwaUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hcGkvc3RvcmFnZUFwaUNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBUTFCLG1EQUFrRDtBQUVsRDs7R0FFRztBQUNIO0lBTUk7OztPQUdHO0lBQ0gsMEJBQVksUUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1UscUNBQVUsR0FBdkIsVUFBd0IsT0FBMkIsRUFBRSxJQUFTOzs7Ozs7d0JBQ3BELEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDOzs7O3dCQUkzQixxQkFBTSxFQUFFLENBQUMsR0FBRyxDQUM5QixxQkFBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3RGLElBQUksQ0FDUCxFQUFBOzt3QkFISyxhQUFhLEdBQUcsU0FHckI7d0JBRUQsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7Ozs7d0JBRTlCLFFBQVEsR0FBRzs0QkFDUCxPQUFPLEVBQUUsS0FBSzs0QkFDZCxPQUFPLEVBQUUsc0RBQW9ELEtBQUs7eUJBQ3JFLENBQUM7OzRCQUdOLHNCQUFPLFFBQVEsRUFBQzs7OztLQUNuQjtJQUVEOzs7OztPQUtHO0lBQ1UscUNBQVUsR0FBdkIsVUFBMkIsT0FBMkI7Ozs7Ozt3QkFDNUMsRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7Ozs7d0JBSTNCLHFCQUFNLEVBQUUsQ0FBQyxHQUFHLENBQzlCLHFCQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekYsRUFBQTs7d0JBRkssYUFBYSxHQUFHLFNBRXJCO3dCQUVELFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDOzs7O3dCQUU5QixRQUFRLEdBQUc7NEJBQ1AsT0FBTyxFQUFFLEtBQUs7NEJBQ2QsT0FBTyxFQUFFLHNEQUFvRCxLQUFLO3lCQUNyRSxDQUFDOzs0QkFHTixzQkFBTyxRQUFRLEVBQUM7Ozs7S0FDbkI7SUFFRDs7Ozs7T0FLRztJQUNVLHdDQUFhLEdBQTFCLFVBQTJCLE9BQThCOzs7Ozs7d0JBQy9DLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDOzs7O3dCQUkzQixxQkFBTSxFQUFFLENBQUMsTUFBTSxDQUNqQyxxQkFBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3pGLEVBQUE7O3dCQUZLLGFBQWEsR0FBRyxTQUVyQjt3QkFFRCxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQzs7Ozt3QkFFOUIsUUFBUSxHQUFHOzRCQUNQLE9BQU8sRUFBRSxLQUFLOzRCQUNkLE9BQU8sRUFBRSxzREFBb0QsS0FBSzt5QkFDckUsQ0FBQzs7NEJBR04sc0JBQU8sUUFBUSxFQUFDOzs7O0tBQ25CO0lBRUQ7Ozs7O09BS0c7SUFDVSxzQ0FBVyxHQUF4QixVQUE0QixPQUE0Qjs7Ozs7O3dCQUM5QyxFQUFFLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzs7Ozt3QkFJM0IscUJBQU0sRUFBRSxDQUFDLEdBQUcsQ0FDOUIscUJBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDMUU7Z0NBQ0ksTUFBTSxFQUFFLHFCQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDOzZCQUN2RSxDQUNKLEVBQUE7O3dCQUxLLGFBQWEsR0FBRyxTQUtyQjt3QkFFRCxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQzs7Ozt3QkFFOUIsUUFBUSxHQUFHOzRCQUNQLE9BQU8sRUFBRSxLQUFLOzRCQUNkLE9BQU8sRUFBRSxzREFBb0QsS0FBSzt5QkFDckUsQ0FBQzs7NEJBR04sc0JBQU8sUUFBUSxFQUFDOzs7O0tBQ25CO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBekhELElBeUhDO0FBekhZLDRDQUFnQiJ9