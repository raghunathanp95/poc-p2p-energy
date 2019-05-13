import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { Inputs } from "@iota/core/typings/types";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IWalletGetResponse } from "../../models/api/IWalletGetResponse";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { WalletStateService } from "../../services/walletStateService";

/**
 * Get the data for the wallet.
 */
export async function walletGet(
    config: IDemoApiConfiguration,
    request: any):
    Promise<IWalletGetResponse> {

    const walletStateService = ServiceFactory.get<WalletStateService>("wallet-state");
    let walletState = await walletStateService.get(config.walletSeed);

    if (!walletState) {
        try {
            const iota = composeAPI(
                ServiceFactory.get<LoadBalancerSettings>("load-balancer-settings")
            );

            const inputsResponse: Inputs = await iota.getInputs(config.walletSeed);

            if (inputsResponse && inputsResponse.totalBalance > 0) {
                walletState = {
                    seed: config.walletSeed,
                    balance: inputsResponse.totalBalance,
                    lastIndex: inputsResponse.inputs[inputsResponse.inputs.length - 1].keyIndex,
                    pendingTransaction: undefined,
                    pendingTransfers: []
                };
                await walletStateService.set(config.walletSeed, walletState);
            }
        } catch (err) {
        }
    }

    return {
        success: true,
        message: "OK",
        balance: walletState ? walletState.balance : 0
    };
}
