import { generateAddress } from "@iota/core";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IPaymentGetAddressRequest } from "p2p-energy-common/dist/models/api/payment/IPaymentGetAddressRequest";
import { IPaymentGetAddressResponse } from "p2p-energy-common/dist/models/api/payment/IPaymentGetAddressResponse";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { PaymentRegistrationService } from "../../services/paymentRegistrationService";

/**
 * Get the address for an entity.
 */
export async function addressPost(
    config: IDemoApiConfiguration,
    request: IPaymentGetAddressRequest):
    Promise<IPaymentGetAddressResponse> {

    ValidationHelper.string(request.registrationId, "registrationId", 27);
    ValidationHelper.number(request.addressIndex, "addressIndex");

    const paymentRegistrationService = ServiceFactory.get<PaymentRegistrationService>("payment-registration");

    const paymentRegistration = await paymentRegistrationService.get(request.registrationId);

    if (!paymentRegistration) {
        throw new Error(`The payment registration '${request.registrationId}' does not exist.`);
    }

    paymentRegistration.lastUsage = Date.now();

    await paymentRegistrationService.set(paymentRegistration.id, paymentRegistration);

    return {
        success: true,
        message: "OK",
        address: generateAddress(paymentRegistration.seed, request.addressIndex, 2)
    };
}
