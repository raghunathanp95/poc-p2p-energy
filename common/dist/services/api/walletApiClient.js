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
class WalletApiClient {
    /**
     * Create a new instance of WalletApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint) {
        this._endpoint = endpoint;
    }
    /**
     * Get the wallet details.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    getWallet(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const ax = axios_1.default.create({ baseURL: this._endpoint });
            let response;
            try {
                const axiosResponse = yield ax.get(apiHelper_1.ApiHelper.joinParams(`wallet`, [request.id, request.incomingEpoch, request.outgoingEpoch]));
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
                const axiosResponse = yield ax.post(apiHelper_1.ApiHelper.joinParams(`wallet`, [request.id, "transfer"]), apiHelper_1.ApiHelper.removeKeys(request, ["id"]));
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
exports.WalletApiClient = WalletApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0QXBpQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FwaS93YWxsZXRBcGlDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFLMUIscURBQWtEO0FBRWxEOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBTXhCOzs7T0FHRztJQUNILFlBQVksUUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1UsU0FBUyxDQUFDLE9BQTBCOztZQUM3QyxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBNEIsQ0FBQztZQUVqQyxJQUFJO2dCQUNBLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDOUIscUJBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUM3RixDQUFDO2dCQUVGLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsUUFBUSxHQUFHO29CQUNQLE9BQU8sRUFBRSxLQUFLO29CQUNkLE9BQU8sRUFBRSxvREFBb0QsR0FBRyxFQUFFO2lCQUNyRSxDQUFDO2FBQ0w7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsUUFBUSxDQUFDLE9BQStCOztZQUNqRCxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBbUIsQ0FBQztZQUV4QixJQUFJO2dCQUNBLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FDL0IscUJBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUN4RCxxQkFBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUN4QyxDQUFDO2dCQUVGLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsUUFBUSxHQUFHO29CQUNQLE9BQU8sRUFBRSxLQUFLO29CQUNkLE9BQU8sRUFBRSxvREFBb0QsR0FBRyxFQUFFO2lCQUNyRSxDQUFDO2FBQ0w7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7Q0FDSjtBQWpFRCwwQ0FpRUMifQ==