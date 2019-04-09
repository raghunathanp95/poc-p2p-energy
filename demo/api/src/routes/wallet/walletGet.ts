import { composeAPI, generateAddress } from "@iota/core";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IStorageService } from "p2p-energy-common/dist/models/services/IStorageService";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IGrid } from "../../models/api/IGrid";
import { IWalletGetRequest } from "../../models/api/IWalletGetRequest";
import { IWalletGetResponse } from "../../models/api/IWalletGetResponse";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { WalletStateService } from "../../services/walletStateService";

/**
 * Get the data for the wallet.
 */
export async function walletGet(
    config: IDemoApiConfiguration,
    request: IWalletGetRequest):
    Promise<IWalletGetResponse> {

    let walletSeed = "";

    // If no grid name get the global wallet details
    if (!request.gridName) {
        walletSeed = config.walletSeed;
    } else {
        ValidationHelper.string(request.gridName, "gridName", 5);
        ValidationHelper.trytes(request.id, 27, "id");
        ValidationHelper.oneOf(request.type, ["producer", "consumer", "grid"], "type");

        const storageService = ServiceFactory.get<IStorageService<IGrid>>("storage");
        const grid = await storageService.get(request.gridName);

        if (!grid) {
            throw new Error(`The grid '${request.gridName}' does not exist.`);
        }

        if (request.type === "grid" && request.id === grid.id)  {
            walletSeed = grid.walletSeed;
        }
    }

    const walletStateService = ServiceFactory.get<WalletStateService>("wallet-state");
    let walletState = await walletStateService.get(walletSeed);

    if (!walletState) {
        try {
            const iota = composeAPI({
                provider: config.node.provider
            });

            const addresses = [generateAddress(walletSeed, 0, 2)];
            const balancesResponse = await iota.getBalances(addresses, 100);
            if (balancesResponse && balancesResponse.balances.length > 0) {
                walletState = {
                    seed: walletSeed,
                    nextIndex: 1,
                    balance: balancesResponse.balances[0]
                };
                await walletStateService.set(walletSeed, walletState);
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
