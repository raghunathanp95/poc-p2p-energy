import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IPaymentRegisterRequest } from "p2p-energy-common/dist/models/api/payment/IPaymentRegisterRequest";
import { IPaymentRegisterResponse } from "p2p-energy-common/dist/models/api/payment/IPaymentRegisterResponse";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { PaymentRegistrationService } from "../../services/paymentRegistrationService";

/**
 * Register an entity to make payments.
 */
export async function registerPost(
    config: IDemoApiConfiguration,
    request: IPaymentRegisterRequest):
    Promise<IPaymentRegisterResponse> {

    ValidationHelper.string(request.registrationId, "registrationId", 27);

    const paymentRegistrationService = ServiceFactory.get<PaymentRegistrationService>("payment-registration");

    let paymentRegistration = await paymentRegistrationService.get(request.registrationId);

    if (!paymentRegistration) {
        paymentRegistration = {
            id: request.registrationId,
            seed: TrytesHelper.generateHash(81),
            lastUsage: Date.now()
        };
    }

    await paymentRegistrationService.set(request.registrationId, paymentRegistration);

    return {
        success: true,
        message: "OK"
    };
}
