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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0QXBpQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FwaS93YWxsZXRBcGlDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQUsxQixxREFBa0Q7QUFFbEQ7O0dBRUc7QUFDSCxNQUFhLGVBQWU7SUFNeEI7OztPQUdHO0lBQ0gsWUFBWSxRQUFnQjtRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVSxTQUFTLENBQUMsT0FBMEI7O1lBQzdDLE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUE0QixDQUFDO1lBRWpDLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUM5QixxQkFBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQzdGLENBQUM7Z0JBRUYsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixRQUFRLEdBQUc7b0JBQ1AsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLG9EQUFvRCxHQUFHLEVBQUU7aUJBQ3JFLENBQUM7YUFDTDtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxRQUFRLENBQUMsT0FBK0I7O1lBQ2pELE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFtQixDQUFDO1lBRXhCLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUMvQixxQkFBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQ3hELHFCQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3hDLENBQUM7Z0JBRUYsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixRQUFRLEdBQUc7b0JBQ1AsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLG9EQUFvRCxHQUFHLEVBQUU7aUJBQ3JFLENBQUM7YUFDTDtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtDQUNKO0FBakVELDBDQWlFQyJ9