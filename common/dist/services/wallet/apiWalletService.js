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
     */
    constructor(apiEndpoint, clientId) {
        this._apiEndpoint = apiEndpoint;
        this._clientId = clientId;
    }
    /**
     * Get the wallet details.
     * @param id The wallet id.
     * @param incomingEpoch Only return incoming transfers after the epoch.
     * @param outgoingEpoch Only return incoming transfers after the epoch.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpV2FsbGV0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy93YWxsZXQvYXBpV2FsbGV0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsNERBQXlEO0FBRXpEOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFXekI7OztPQUdHO0lBQ0gsWUFBWSxXQUFtQixFQUFFLFFBQWdCO1FBQzdDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDVSxTQUFTLENBQUMsRUFBVSxFQUFFLGFBQXNCLEVBQUUsYUFBc0I7O1lBQzdFLE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDL0QsT0FBTyxlQUFlLENBQUMsU0FBUyxDQUFDO2dCQUM3QixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsRUFBRTtnQkFDNUIsYUFBYTtnQkFDYixhQUFhO2FBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2YsSUFBSSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7b0JBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN4RCxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzs0QkFDbkMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDN0Y7aUJBQ0o7Z0JBRUQsSUFBSSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7b0JBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN4RCxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzs0QkFDbkMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDN0Y7aUJBQ0o7Z0JBRUQsT0FBTyxRQUFRLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLFFBQVEsQ0FDakIsRUFBVSxFQUNWLGFBQXFCLEVBQ3JCLE1BQWM7O1lBQ2QsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvRCxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQzVCLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxFQUFFO2dCQUM1QixhQUFhLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsRUFBRTtnQkFDbEQsTUFBTTthQUNULENBQUM7aUJBQ0csSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBO0NBQ0o7QUF0RUQsNENBc0VDIn0=