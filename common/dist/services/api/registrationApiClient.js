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
 * Class to handle registration api communications.
 */
class RegistrationApiClient {
    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint) {
        this._endpoint = endpoint;
    }
    /**
     * Register with the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    registrationSet(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.put(`registration/${request.registrationId}`, apiHelper_1.ApiHelper.removeKeys(request, ["registrationId"]));
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
     * Unregister from the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    registrationDelete(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.delete(`registration/${request.registrationId}/${request.sideKey}`);
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
exports.RegistrationApiClient = RegistrationApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uQXBpQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FwaS9yZWdpc3RyYXRpb25BcGlDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFLMUIscURBQWtEO0FBRWxEOztHQUVHO0FBQ0gsTUFBYSxxQkFBcUI7SUFNOUI7OztPQUdHO0lBQ0gsWUFBWSxRQUFnQjtRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLGVBQWUsQ0FBQyxPQUFnQzs7WUFDekQsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNyRCxJQUFJLFFBQWtDLENBQUM7WUFFdkMsSUFBSTtnQkFDQSxNQUFNLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQzlCLGdCQUFnQixPQUFPLENBQUMsY0FBYyxFQUFFLEVBQ3hDLHFCQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FDcEQsQ0FBQztnQkFFRixRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQzthQUNqQztZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLFFBQVEsR0FBRztvQkFDUCxPQUFPLEVBQUUsS0FBSztvQkFDZCxPQUFPLEVBQUUsb0RBQW9ELEdBQUcsRUFBRTtpQkFDckUsQ0FBQzthQUNMO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLGtCQUFrQixDQUFDLE9BQW1DOztZQUMvRCxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBbUIsQ0FBQztZQUV4QixJQUFJO2dCQUNBLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FDakMsZ0JBQWdCLE9BQU8sQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUM5RCxDQUFDO2dCQUVGLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsUUFBUSxHQUFHO29CQUNQLE9BQU8sRUFBRSxLQUFLO29CQUNkLE9BQU8sRUFBRSxvREFBb0QsR0FBRyxFQUFFO2lCQUNyRSxDQUFDO2FBQ0w7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7Q0FDSjtBQWhFRCxzREFnRUMifQ==