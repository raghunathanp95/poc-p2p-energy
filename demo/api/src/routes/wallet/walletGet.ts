import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { generateAddress } from "@iota/core";
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

            const addresses = [generateAddress(config.walletSeed, 0, 2)];
            const balancesResponse = await iota.getBalances(addresses, 100);
            if (balancesResponse && balancesResponse.balances.length > 0) {
                walletState = {
                    seed: config.walletSeed,
                    nextIndex: 1,
                    balance: balancesResponse.balances[0]
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
