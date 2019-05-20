import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { Inputs } from "@iota/core";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { IWallet } from "../../models/services/IWallet";
import { WalletService } from "../../services/walletService";
import { WalletTransferService } from "../../services/walletTransferService";

/**
 * Sweep all the registrations and move the iotas back to demo wallet.
 */
export async function sweepGet(
    config: IDemoApiConfiguration,
    request: any):
    Promise<any> {

    const walletService = ServiceFactory.get<WalletService>("wallet");

    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    const walletTransferService = ServiceFactory.get<WalletTransferService>("wallet-transfer");

    const iota = composeAPI(ServiceFactory.get<LoadBalancerSettings>("load-balancer-settings"));

    let pageSize = 10;
    let page = 0;
    let pageResponse;
    do {
        pageResponse = await walletService.page(undefined, page, pageSize);

        for (let i = 0; i < pageResponse.items.length; i++) {
            const wallet: IWallet = pageResponse.items[i];
            if (wallet.id !== "global") {
                const inputsResponse: Inputs = await iota.getInputs(wallet.seed, {
                    start: wallet.startIndex,
                    end: Math.max(wallet.startIndex + 20, wallet.lastIndex)
                });

                if (inputsResponse && inputsResponse.totalBalance > 0) {
                    loggingService.log("wallet", `Sweeping ${wallet.id} balance ${inputsResponse.totalBalance}`);

                    walletTransferService.addTransfer({
                        sourceWalletId: wallet.id,
                        receiveWalletId: "global",
                        value: inputsResponse.totalBalance,
                        tag: "P9TO9P9ENERGY9POC",
                        message: TrytesHelper.toTrytes({
                            from: wallet.id,
                            to: "global"
                        })
                    });
                }
            }
        }
        page++;
        pageSize = pageResponse.pageSize;
    } while (pageResponse && pageResponse.ids && pageResponse.ids.length > 0);

    return {
        success: true,
        message: "OK"
    };
}
