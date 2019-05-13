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
const paymentApiClient_1 = require("../api/paymentApiClient");
/**
 * Service to handle payment using the payment api.
 */
class ApiPaymentService {
    /**
     * Create a new instance of ApiPaymentService
     * @param apiEndpoint The api configuration.
     */
    constructor(apiEndpoint) {
        this._apiEndpoint = apiEndpoint;
    }
    /**
     * Register with the payment service.
     * @param registrationId The registration id.
     * @returns True if registration was successful.
     */
    register(registrationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentApiClient = new paymentApiClient_1.PaymentApiClient(this._apiEndpoint);
            return paymentApiClient.register({ registrationId }).then(response => response.success);
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
            const paymentApiClient = new paymentApiClient_1.PaymentApiClient(this._apiEndpoint);
            return paymentApiClient.getAddress({ registrationId, addressIndex }).then(response => response.address);
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
            const paymentApiClient = new paymentApiClient_1.PaymentApiClient(this._apiEndpoint);
            return paymentApiClient.transfer({ registrationId, toRegistrationId, address: address, amount })
                .then(response => response.bundle);
        });
    }
}
exports.ApiPaymentService = ApiPaymentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpUGF5bWVudFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvcGF5bWVudC9hcGlQYXltZW50U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsOERBQTJEO0FBRTNEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFNMUI7OztPQUdHO0lBQ0gsWUFBWSxXQUFtQjtRQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLFFBQVEsQ0FBQyxjQUFzQjs7WUFDeEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqRSxPQUFPLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVGLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsVUFBVSxDQUFDLGNBQXNCLEVBQUUsWUFBb0I7O1lBQ2hFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakUsT0FBTyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUcsQ0FBQztLQUFBO0lBRUQ7Ozs7Ozs7T0FPRztJQUNVLFFBQVEsQ0FDakIsY0FBc0IsRUFDdEIsZ0JBQXdCLEVBQ3hCLE9BQWUsRUFDZixNQUFjOztZQUNkLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakUsT0FBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztpQkFDM0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLENBQUM7S0FBQTtDQUNKO0FBcERELDhDQW9EQyJ9