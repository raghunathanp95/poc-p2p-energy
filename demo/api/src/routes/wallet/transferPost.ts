import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IResponse } from "p2p-energy-common/dist/models/api/IResponse";
import { IWalletTransferRequest } from "p2p-energy-common/dist/models/api/wallet/IWalletTransferRequest";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { WalletService } from "../../services/walletService";
import { WalletTransferService } from "../../services/walletTransferService";

/**
 * Transfer a payment between entities.
 */
export async function transferPost(
    config: IDemoApiConfiguration,
    request: IWalletTransferRequest):
    Promise<IResponse> {

    ValidationHelper.trytes(request.id, 27, "id");
    ValidationHelper.trytes(request.toIdOrAddress, 27, "toIdOrAddress");
    ValidationHelper.number(request.amount, "amount");

    const walletService = ServiceFactory.get<WalletService>("wallet");
    await walletService.getOrCreate(
        request.id,
        request.id === "global" ? config.walletSeed : undefined,
        ServiceFactory.get<LoadBalancerSettings>("load-balancer-settings"));

    const walletTransferService = ServiceFactory.get<WalletTransferService>("wallet-transfer");
    walletTransferService.addTransfer(
        {
            sourceWalletId: "global",
            receiveWalletId: request.toIdOrAddress,
            value: request.amount,
            tag: "P9TO9P9ENERGY9POC",
            payload: {
                from: request.id,
                to: request.toIdOrAddress
            }
        }
    );

    return {
        success: true,
        message: "OK"
    };
}
