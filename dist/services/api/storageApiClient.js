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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const apiHelper_1 = require("../../utils/apiHelper");
/**
 * Class to handle storage api communications.
 */
class StorageApiClient {
    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint) {
        this._endpoint = endpoint;
    }
    /**
     * Store something with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageSet(request, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.put(apiHelper_1.ApiHelper.joinParams(`storage`, [request.registrationId, request.context, request.id]), data);
                response = axiosResponse.data;
            }
            catch (err) {
                response = {
                    success: false,
                    message: `There was a problem communicating with the API.\n${err}`
                };
            }
            return response;
        });
    }
    /**
     * Get something stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageGet(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.get(apiHelper_1.ApiHelper.joinParams(`storage`, [request.registrationId, request.context, request.id]));
                response = axiosResponse.data;
            }
            catch (err) {
                response = {
                    success: false,
                    message: `There was a problem communicating with the API.\n${err}`
                };
            }
            return response;
        });
    }
    /**
     * Delete something stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageDelete(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.delete(apiHelper_1.ApiHelper.joinParams(`storage`, [request.registrationId, request.context, request.id]));
                response = axiosResponse.data;
            }
            catch (err) {
                response = {
                    success: false,
                    message: `There was a problem communicating with the API.\n${err}`
                };
            }
            return response;
        });
    }
    /**
     * List items stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.get(apiHelper_1.ApiHelper.joinParams(`storage`, [request.registrationId, request.context]), {
                    params: apiHelper_1.ApiHelper.removeKeys(request, ["registrationId", "context"])
                });
                response = axiosResponse.data;
            }
            catch (err) {
                response = {
                    success: false,
                    message: `There was a problem communicating with the API.\n${err}`
                };
            }
            return response;
        });
    }
}
exports.StorageApiClient = StorageApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZUFwaUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hcGkvc3RvcmFnZUFwaUNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQVExQixxREFBa0Q7QUFFbEQ7O0dBRUc7QUFDSCxNQUFhLGdCQUFnQjtJQU16Qjs7O09BR0c7SUFDSCxZQUFZLFFBQWdCO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNVLFVBQVUsQ0FBQyxPQUEyQixFQUFFLElBQVM7O1lBQzFELE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFtQixDQUFDO1lBRXhCLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUM5QixxQkFBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3RGLElBQUksQ0FDUCxDQUFDO2dCQUVGLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsUUFBUSxHQUFHO29CQUNQLE9BQU8sRUFBRSxLQUFLO29CQUNkLE9BQU8sRUFBRSxvREFBb0QsR0FBRyxFQUFFO2lCQUNyRSxDQUFDO2FBQ0w7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLFVBQVUsQ0FBSSxPQUEyQjs7WUFDbEQsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNyRCxJQUFJLFFBQWdDLENBQUM7WUFFckMsSUFBSTtnQkFDQSxNQUFNLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQzlCLHFCQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekYsQ0FBQztnQkFFRixRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQzthQUNqQztZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLFFBQVEsR0FBRztvQkFDUCxPQUFPLEVBQUUsS0FBSztvQkFDZCxPQUFPLEVBQUUsb0RBQW9ELEdBQUcsRUFBRTtpQkFDckUsQ0FBQzthQUNMO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDVSxhQUFhLENBQUMsT0FBOEI7O1lBQ3JELE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFtQixDQUFDO1lBRXhCLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUNqQyxxQkFBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3pGLENBQUM7Z0JBRUYsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixRQUFRLEdBQUc7b0JBQ1AsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLG9EQUFvRCxHQUFHLEVBQUU7aUJBQ3JFLENBQUM7YUFDTDtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsV0FBVyxDQUFJLE9BQTRCOztZQUNwRCxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBaUMsQ0FBQztZQUV0QyxJQUFJO2dCQUNBLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDOUIscUJBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDMUU7b0JBQ0ksTUFBTSxFQUFFLHFCQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUN2RSxDQUNKLENBQUM7Z0JBRUYsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixRQUFRLEdBQUc7b0JBQ1AsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLG9EQUFvRCxHQUFHLEVBQUU7aUJBQ3JFLENBQUM7YUFDTDtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtDQUNKO0FBekhELDRDQXlIQyJ9