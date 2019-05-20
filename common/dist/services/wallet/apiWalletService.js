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
    constructor(apiEndpoint) {
        this._apiEndpoint = apiEndpoint;
    }
    /**
     * Get the wallet details.
     * @param id The wallet id.
     * @returns The wallet.
     */
    getWallet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentApiClient = new walletApiClient_1.WalletApiClient(this._apiEndpoint);
            return paymentApiClient.getWallet({ id }).then(response => response.wallet);
        });
    }
    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toId The wallet id the payment is to.
     * @param amount The amount of the payment.
     */
    transfer(id, toId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentApiClient = new walletApiClient_1.WalletApiClient(this._apiEndpoint);
            return paymentApiClient.transfer({ id, toId, amount })
                .then(response => undefined);
        });
    }
}
exports.ApiWalletService = ApiWalletService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpV2FsbGV0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy93YWxsZXQvYXBpV2FsbGV0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsNERBQXlEO0FBRXpEOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFNekI7OztPQUdHO0lBQ0gsWUFBWSxXQUFtQjtRQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLFNBQVMsQ0FBQyxFQUFVOztZQUM3QixNQUFNLGdCQUFnQixHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDaEUsT0FBTyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLFFBQVEsQ0FDakIsRUFBVSxFQUNWLElBQVksRUFDWixNQUFjOztZQUNkLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRSxPQUFPLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7aUJBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7S0FBQTtDQUNKO0FBdENELDRDQXNDQyJ9