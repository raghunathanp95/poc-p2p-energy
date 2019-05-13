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
const client_load_balancer_1 = require("@iota/client-load-balancer");
const core_1 = require("@iota/core");
const trytesHelper_1 = require("../../utils/trytesHelper");
/**
 * Service to handle payment.
 */
class SimplePaymentService {
    /**
     * Create a new instance of SimplePaymentService
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param walletSeed The wallet seed.
     */
    constructor(loadBalancerSettings, walletSeed) {
        this._loadBalancerSettings = loadBalancerSettings;
        this._walletSeed = walletSeed;
    }
    /**
     * Register with the payment service.
     * @param registrationId The registration id.
     * @returns True if registration was successful.
     */
    register(registrationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    /**
     * Generate an address for the registration.
     * @param registrationId The registration id.
     * @param addressIndex The address index.
     * @returns The generated address.
     */
    getAddress(registrationId, addressIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            return core_1.generateAddress(this._walletSeed, addressIndex, 2);
        });
    }
    /**
     * Make a payment from a registration.
     * @param registrationId The registration the payment is from.
     * @param toRegistrationId The registration the payment is to.
     * @param address The address we are making the payment to.
     * @param amount The amount of the payment.
     * @returns The bundle hash for the payment.
     */
    transfer(registrationId, toRegistrationId, address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const iota = client_load_balancer_1.composeAPI(this._loadBalancerSettings);
            const inputsResult = yield iota.getInputs(this._walletSeed);
            const trytes = yield iota.prepareTransfers(this._walletSeed, [
                {
                    address: address,
                    value: amount,
                    tag: "P2P9ENERGY9POC",
                    message: trytesHelper_1.TrytesHelper.toTrytes({
                        from: registrationId
                    })
                }
            ], {
                inputs: inputsResult.inputs
            });
            const bundle = yield iota.sendTrytes(trytes, undefined, undefined);
            return bundle[0].bundle;
        });
    }
}
exports.SimplePaymentService = SimplePaymentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlUGF5bWVudFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvcGF5bWVudC9zaW1wbGVQYXltZW50U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUVBQThFO0FBQzlFLHFDQUE2QztBQUU3QywyREFBd0Q7QUFFeEQ7O0dBRUc7QUFDSCxNQUFhLG9CQUFvQjtJQVc3Qjs7OztPQUlHO0lBQ0gsWUFBWSxvQkFBMEMsRUFBRSxVQUFrQjtRQUN0RSxJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxRQUFRLENBQUMsY0FBc0I7O1lBQ3hDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsVUFBVSxDQUFDLGNBQXNCLEVBQUUsWUFBb0I7O1lBQ2hFLE9BQU8sc0JBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDO0tBQUE7SUFFRDs7Ozs7OztPQU9HO0lBQ1UsUUFBUSxDQUNqQixjQUFzQixFQUN0QixnQkFBd0IsRUFDeEIsT0FBZSxFQUNmLE1BQWM7O1lBRWQsTUFBTSxJQUFJLEdBQUcsaUNBQVUsQ0FDbkIsSUFBSSxDQUFDLHFCQUFxQixDQUM3QixDQUFDO1lBRUYsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUU1RCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FDdEMsSUFBSSxDQUFDLFdBQVcsRUFDaEI7Z0JBQ0k7b0JBQ0ksT0FBTyxFQUFFLE9BQU87b0JBQ2hCLEtBQUssRUFBRSxNQUFNO29CQUNiLEdBQUcsRUFBRSxnQkFBZ0I7b0JBQ3JCLE9BQU8sRUFBRSwyQkFBWSxDQUFDLFFBQVEsQ0FBQzt3QkFDM0IsSUFBSSxFQUFFLGNBQWM7cUJBQ3ZCLENBQUM7aUJBQ0w7YUFDSixFQUNEO2dCQUNJLE1BQU0sRUFBRSxZQUFZLENBQUMsTUFBTTthQUM5QixDQUFDLENBQUM7WUFFUCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUVuRSxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDNUIsQ0FBQztLQUFBO0NBQ0o7QUFoRkQsb0RBZ0ZDIn0=