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
 * Class to handle storage api communications.
 */
class PaymentApiClient {
    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint) {
        this._endpoint = endpoint;
    }
    /**
     * Register with the payment service.
     * @param request The request to send.
     * @returns The response from the request.
     */
    register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.post(`payment/register`, request);
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
     * Generate a new address.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    getAddress(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.post(apiHelper_1.ApiHelper.joinParams(`payment`, [request.registrationId, "address"]), apiHelper_1.ApiHelper.removeKeys(request, ["registrationId"]));
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
     * Make a payment between registrations.
     * @param request The request to send.
     * @returns The response from the request.
     */
    transfer(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.post(apiHelper_1.ApiHelper.joinParams(`payment`, [request.registrationId, "transfer"]), apiHelper_1.ApiHelper.removeKeys(request, ["fromRegistrationId"]));
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
exports.PaymentApiClient = PaymentApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudEFwaUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hcGkvcGF5bWVudEFwaUNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBUTFCLHFEQUFrRDtBQUVsRDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBTXpCOzs7T0FHRztJQUNILFlBQVksUUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxRQUFRLENBQUMsT0FBZ0M7O1lBQ2xELE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFtQixDQUFDO1lBRXhCLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUMvQixrQkFBa0IsRUFDbEIsT0FBTyxDQUNWLENBQUM7Z0JBRUYsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixRQUFRLEdBQUc7b0JBQ1AsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLG9EQUFvRCxHQUFHLEVBQUU7aUJBQ3JFLENBQUM7YUFDTDtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsVUFBVSxDQUFDLE9BQWtDOztZQUN0RCxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBb0MsQ0FBQztZQUV6QyxJQUFJO2dCQUNBLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FDL0IscUJBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUNwRSxxQkFBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQ3BELENBQUM7Z0JBRUYsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixRQUFRLEdBQUc7b0JBQ1AsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLG9EQUFvRCxHQUFHLEVBQUU7aUJBQ3JFLENBQUM7YUFDTDtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxRQUFRLENBQUMsT0FBZ0M7O1lBQ2xELE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFrQyxDQUFDO1lBRXZDLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUMvQixxQkFBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQ3JFLHFCQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FDeEQsQ0FBQztnQkFFRixRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQzthQUNqQztZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLFFBQVEsR0FBRztvQkFDUCxPQUFPLEVBQUUsS0FBSztvQkFDZCxPQUFPLEVBQUUsb0RBQW9ELEdBQUcsRUFBRTtpQkFDckUsQ0FBQzthQUNMO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztLQUFBO0NBQ0o7QUE1RkQsNENBNEZDIn0=