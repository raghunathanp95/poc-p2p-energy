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
 * Class to handle registration api communications.
 */
var RegistrationApiClient = /** @class */ (function () {
    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    function RegistrationApiClient(endpoint) {
        this._endpoint = endpoint;
    }
    /**
     * Register with the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    RegistrationApiClient.prototype.registrationSet = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var ax, response, axiosResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ax = axios_1.default.create({ baseURL: this._endpoint });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ax.put("registration/" + request.registrationId, apiHelper_1.ApiHelper.removeKeys(request, ["registrationId"]))];
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
     * Unregister from the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    RegistrationApiClient.prototype.registrationDelete = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var ax, response, axiosResponse, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ax = axios_1.default.create({ baseURL: this._endpoint });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ax.delete("registration/" + request.registrationId)];
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
    return RegistrationApiClient;
}());
exports.RegistrationApiClient = RegistrationApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uQXBpQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FwaS9yZWdpc3RyYXRpb25BcGlDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUsxQixtREFBa0Q7QUFFbEQ7O0dBRUc7QUFDSDtJQU1JOzs7T0FHRztJQUNILCtCQUFZLFFBQWdCO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsK0NBQWUsR0FBNUIsVUFBNkIsT0FBZ0M7Ozs7Ozt3QkFDbkQsRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7Ozs7d0JBSTNCLHFCQUFNLEVBQUUsQ0FBQyxHQUFHLENBQzlCLGtCQUFnQixPQUFPLENBQUMsY0FBZ0IsRUFDeEMscUJBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUNwRCxFQUFBOzt3QkFISyxhQUFhLEdBQUcsU0FHckI7d0JBRUQsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7Ozs7d0JBRTlCLFFBQVEsR0FBRzs0QkFDUCxPQUFPLEVBQUUsS0FBSzs0QkFDZCxPQUFPLEVBQUUsc0RBQW9ELEtBQUs7eUJBQ3JFLENBQUM7OzRCQUdOLHNCQUFPLFFBQVEsRUFBQzs7OztLQUNuQjtJQUVEOzs7O09BSUc7SUFDVSxrREFBa0IsR0FBL0IsVUFBZ0MsT0FBbUM7Ozs7Ozt3QkFDekQsRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7Ozs7d0JBSTNCLHFCQUFNLEVBQUUsQ0FBQyxNQUFNLENBQVksa0JBQWdCLE9BQU8sQ0FBQyxjQUFnQixDQUFDLEVBQUE7O3dCQUFwRixhQUFhLEdBQUcsU0FBb0U7d0JBRTFGLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDOzs7O3dCQUU5QixRQUFRLEdBQUc7NEJBQ1AsT0FBTyxFQUFFLEtBQUs7NEJBQ2QsT0FBTyxFQUFFLHNEQUFvRCxLQUFLO3lCQUNyRSxDQUFDOzs0QkFHTixzQkFBTyxRQUFRLEVBQUM7Ozs7S0FDbkI7SUFDTCw0QkFBQztBQUFELENBQUMsQUE5REQsSUE4REM7QUE5RFksc0RBQXFCIn0=