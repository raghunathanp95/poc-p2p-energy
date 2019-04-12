"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
                const axiosResponse = yield ax.delete(`registration/${request.registrationId}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uQXBpQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FwaS9yZWdpc3RyYXRpb25BcGlDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQUsxQixxREFBa0Q7QUFFbEQ7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQU05Qjs7O09BR0c7SUFDSCxZQUFZLFFBQWdCO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsZUFBZSxDQUFDLE9BQWdDOztZQUN6RCxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBa0MsQ0FBQztZQUV2QyxJQUFJO2dCQUNBLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDOUIsZ0JBQWdCLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFDeEMscUJBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUNwRCxDQUFDO2dCQUVGLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsUUFBUSxHQUFHO29CQUNQLE9BQU8sRUFBRSxLQUFLO29CQUNkLE9BQU8sRUFBRSxvREFBb0QsR0FBRyxFQUFFO2lCQUNyRSxDQUFDO2FBQ0w7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1Usa0JBQWtCLENBQUMsT0FBbUM7O1lBQy9ELE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFtQixDQUFDO1lBRXhCLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFZLGdCQUFnQixPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFFM0YsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixRQUFRLEdBQUc7b0JBQ1AsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLG9EQUFvRCxHQUFHLEVBQUU7aUJBQ3JFLENBQUM7YUFDTDtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtDQUNKO0FBOURELHNEQThEQyJ9