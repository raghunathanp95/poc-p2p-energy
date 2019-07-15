"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletApiClient_1 = require("../api/walletApiClient");
/**
 * Service to handle payment using the wallet api.
 */
class ApiWalletService {
    /**
     * Create a new instance of ApiPaymentService
     * @param apiEndpoint The api configuration.
     * @param clientId The client id for the wallet.
     */
    constructor(apiEndpoint, clientId) {
        this._apiEndpoint = apiEndpoint;
        this._clientId = clientId;
    }
    /**
     * Get the wallet details.
     * @param id The wallet id.
     * @param incomingEpoch Only return incoming transfers after the epoch.
     * @param outgoingEpoch Only return outgoing transfers after the epoch.
     * @returns The wallet.
     */
    getWallet(id, incomingEpoch, outgoingEpoch) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletApiClient = new walletApiClient_1.WalletApiClient(this._apiEndpoint);
            return walletApiClient.getWallet({
                id: `${this._clientId}${id}`,
                incomingEpoch,
                outgoingEpoch
            }).then(response => {
                if (response.incomingTransfers) {
                    for (let i = 0; i < response.incomingTransfers.length; i++) {
                        response.incomingTransfers[i].reference =
                            response.incomingTransfers[i].reference.replace(new RegExp(`^${this._clientId}`), "");
                    }
                }
                if (response.outgoingTransfers) {
                    for (let i = 0; i < response.outgoingTransfers.length; i++) {
                        response.outgoingTransfers[i].reference =
                            response.outgoingTransfers[i].reference.replace(new RegExp(`^${this._clientId}`), "");
                    }
                }
                return response;
            });
        });
    }
    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toIdOrAddress The wallet id the payment is to.
     * @param amount The amount of the payment.
     * @returns Nothing.
     */
    transfer(id, toIdOrAddress, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletApiClient = new walletApiClient_1.WalletApiClient(this._apiEndpoint);
            return walletApiClient.transfer({
                id: `${this._clientId}${id}`,
                toIdOrAddress: `${this._clientId}${toIdOrAddress}`,
                amount
            })
                .then(response => undefined);
        });
    }
}
exports.ApiWalletService = ApiWalletService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpV2FsbGV0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy93YWxsZXQvYXBpV2FsbGV0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsNERBQXlEO0FBRXpEOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFXekI7Ozs7T0FJRztJQUNILFlBQVksV0FBbUIsRUFBRSxRQUFnQjtRQUM3QyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsU0FBUyxDQUFDLEVBQVUsRUFBRSxhQUFzQixFQUFFLGFBQXNCOztZQUM3RSxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9ELE9BQU8sZUFBZSxDQUFDLFNBQVMsQ0FBQztnQkFDN0IsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUU7Z0JBQzVCLGFBQWE7Z0JBQ2IsYUFBYTthQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNmLElBQUksUUFBUSxDQUFDLGlCQUFpQixFQUFFO29CQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDeEQsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7NEJBQ25DLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQzdGO2lCQUNKO2dCQUVELElBQUksUUFBUSxDQUFDLGlCQUFpQixFQUFFO29CQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDeEQsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7NEJBQ25DLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQzdGO2lCQUNKO2dCQUVELE9BQU8sUUFBUSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsUUFBUSxDQUNqQixFQUFVLEVBQ1YsYUFBcUIsRUFDckIsTUFBYzs7WUFDZCxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9ELE9BQU8sZUFBZSxDQUFDLFFBQVEsQ0FBQztnQkFDNUIsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUU7Z0JBQzVCLGFBQWEsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxFQUFFO2dCQUNsRCxNQUFNO2FBQ1QsQ0FBQztpQkFDRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQUE7Q0FDSjtBQXhFRCw0Q0F3RUMifQ==