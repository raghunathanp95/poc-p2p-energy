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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpV2FsbGV0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy93YWxsZXQvYXBpV2FsbGV0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLDREQUF5RDtBQUV6RDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBV3pCOzs7O09BSUc7SUFDSCxZQUFZLFdBQW1CLEVBQUUsUUFBZ0I7UUFDN0MsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNVLFNBQVMsQ0FBQyxFQUFVLEVBQUUsYUFBc0IsRUFBRSxhQUFzQjs7WUFDN0UsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvRCxPQUFPLGVBQWUsQ0FBQyxTQUFTLENBQUM7Z0JBQzdCLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxFQUFFO2dCQUM1QixhQUFhO2dCQUNiLGFBQWE7YUFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDZixJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3hELFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTOzRCQUNuQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUM3RjtpQkFDSjtnQkFFRCxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3hELFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTOzRCQUNuQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUM3RjtpQkFDSjtnQkFFRCxPQUFPLFFBQVEsQ0FBQztZQUNwQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNVLFFBQVEsQ0FDakIsRUFBVSxFQUNWLGFBQXFCLEVBQ3JCLE1BQWM7O1lBQ2QsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvRCxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQzVCLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxFQUFFO2dCQUM1QixhQUFhLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsRUFBRTtnQkFDbEQsTUFBTTthQUNULENBQUM7aUJBQ0csSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBO0NBQ0o7QUF4RUQsNENBd0VDIn0=