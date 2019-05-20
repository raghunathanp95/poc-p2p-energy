import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { Inputs } from "@iota/core/typings/types";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IWalletGetResponse } from "p2p-energy-common/dist/models/api/wallet/IWalletGetResponse";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { WalletService } from "../../services/walletService";

/**
 * Get the data for the wallet.
 */
export async function walletGet(
    config: IDemoApiConfiguration,
    request: any):
    Promise<IWalletGetResponse> {

    ValidationHelper.string(request.id, "id");

    const walletService = ServiceFactory.get<WalletService>("wallet");
    let wallet = await walletService.get(request.id);

    if (!wallet) {
        try {
            const iota = composeAPI(
                ServiceFactory.get<LoadBalancerSettings>("load-balancer-settings")
            );

            const seed = request.id === "global" ? config.walletSeed : TrytesHelper.generateHash(81);
            let balance = 0;
            let startIndex = 0;
            let lastIndex = 0;

            if (request.id === "global") {
                const inputsResponse: Inputs = await iota.getInputs(config.walletSeed, { start: 20 });
                if (inputsResponse && inputsResponse.totalBalance > 0) {
                    balance = inputsResponse.totalBalance;
                    startIndex = inputsResponse.inputs[0].keyIndex;
                    lastIndex = inputsResponse.inputs[inputsResponse.inputs.length - 1].keyIndex;
                }
                lastIndex++;
            } else {
                lastIndex++;
            }

            wallet = {
                id: request.id,
                seed,
                balance,
                startIndex,
                lastIndex
            };
            await walletService.set(wallet.id, wallet);

        } catch (err) {
        }
    }

    return {
        success: true,
        message: "OK",
        wallet: {
            balance: wallet && wallet.balance,
            incomingBundleHash: wallet && wallet.lastIncomingTransfer && wallet.lastIncomingTransfer.bundle,
            outgoingBundleHash: wallet && wallet.lastOutgoingTransfer && wallet.lastOutgoingTransfer.bundle
        }
    };
}
