import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { generateAddress } from "@iota/core";
import { Inputs } from "@iota/core/typings/types";
import { asTransactionObject } from "@iota/transaction-converter";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IPaymentTransferRequest } from "p2p-energy-common/dist/models/api/payment/IPaymentTransferRequest";
import { IPaymentTransferResponse } from "p2p-energy-common/dist/models/api/payment/IPaymentTransferResponse";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { PaymentRegistrationService } from "../../services/paymentRegistrationService";
import { WalletStateService } from "../../services/walletStateService";

/**
 * Transfer a payment between entities.
 */
export async function transferPost(
    config: IDemoApiConfiguration,
    request: IPaymentTransferRequest):
    Promise<IPaymentTransferResponse> {

    ValidationHelper.trytes(request.registrationId, 27, "registrationId");
    ValidationHelper.trytes(request.toRegistrationId, 27, "toRegistrationId");
    ValidationHelper.trytes(request.address, 81, "address");
    ValidationHelper.number(request.amount, "amount");

    const paymentRegistrationService = ServiceFactory.get<PaymentRegistrationService>("payment-registration");

    const paymentRegistrationFrom = await paymentRegistrationService.get(request.registrationId);
    if (!paymentRegistrationFrom) {
        throw new Error(`The payment registration from '${request.registrationId}' does not exist.`);
    }

    const paymentRegistrationTo = await paymentRegistrationService.get(request.registrationId);
    if (!paymentRegistrationTo) {
        throw new Error(`The payment registration to '${request.registrationId}' does not exist.`);
    }

    paymentRegistrationFrom.lastUsage = Date.now();
    paymentRegistrationTo.lastUsage = Date.now();

    await paymentRegistrationService.set(paymentRegistrationFrom.id, paymentRegistrationFrom);
    await paymentRegistrationService.set(paymentRegistrationTo.id, paymentRegistrationTo);

    const walletStateService = ServiceFactory.get<WalletStateService>("wallet-state");
    const walletState = await walletStateService.get(config.walletSeed);

    const iota = composeAPI(
        ServiceFactory.get<LoadBalancerSettings>("load-balancer-settings")
    );

    const transfers = [
        {
            address: request.address,
            value: request.amount,
            tag: "P2P9ENERGY9POC",
            message: TrytesHelper.toTrytes({
                from: request.registrationId
            })
        }
    ];

    const inputsResponse: Inputs = await iota.getInputs(walletState.seed, { start: walletState.lastIndex });
    const newLastIndex = inputsResponse.inputs[inputsResponse.inputs.length - 1].keyIndex;

    const remainderAddress = generateAddress(
        walletState.seed,
        newLastIndex,
        2);

    const trytes = await iota.prepareTransfers(
        walletState.seed,
        transfers,
        {
            inputs: inputsResponse.inputs,
            remainderAddress
        });

    const txs = trytes.map(asTransactionObject);

    walletState.pendingTransfers.push(txs);
    walletState.lastIndex = newLastIndex;

    await walletStateService.set(walletState.seed, walletState);

    return {
        success: true,
        message: "OK",
        bundle: txs[0].bundle
    };
}
