import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IWalletTransferRequest } from "p2p-energy-common/dist/models/api/wallet/IWalletTransferRequest";
import { IWalletTransferResponse } from "p2p-energy-common/dist/models/api/wallet/IWalletTransferResponse";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { WalletTransferService } from "../../services/walletTransferService";

/**
 * Transfer a payment between entities.
 */
export async function transferPost(
    config: IDemoApiConfiguration,
    request: IWalletTransferRequest):
    Promise<IWalletTransferResponse> {

    ValidationHelper.trytes(request.id, 27, "id");
    ValidationHelper.trytes(request.toId, 27, "toId");
    ValidationHelper.number(request.amount, "amount");

    const walletTransferService = ServiceFactory.get<WalletTransferService>("wallet-transfer");

    await walletTransferService.addTransfer(
        {
            sourceWalletId: "global",
            receiveWalletId: request.toId,
            value: request.amount,
            tag: "P9TO9P9ENERGY9POC",
            message: TrytesHelper.toTrytes({
                from: request.id,
                to: request.toId
            })
        }
    );

    return {
        success: true,
        message: "OK"
    };
}
