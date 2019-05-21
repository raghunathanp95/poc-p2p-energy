import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IWalletGetRequest } from "p2p-energy-common/dist/models/api/wallet/IWalletGetRequest";
import { IWalletGetResponse } from "p2p-energy-common/dist/models/api/wallet/IWalletGetResponse";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IDemoApiConfiguration } from "../../models/IDemoApiConfiguration";
import { WalletService } from "../../services/walletService";

/**
 * Get the data for the wallet.
 */
export async function walletGet(
    config: IDemoApiConfiguration,
    request: IWalletGetRequest):
    Promise<IWalletGetResponse> {

    ValidationHelper.string(request.id, "id");

    const walletService = ServiceFactory.get<WalletService>("wallet");
    const wallet = await walletService.getOrCreate(
        request.id,
        request.id === "global" ? config.walletSeed : undefined,
        ServiceFactory.get<LoadBalancerSettings>("load-balancer-settings"));

    let changed = false;
    let incomingTransfers;
    let outgoingTransfers;
    if (wallet && wallet.incomingTransfers) {
        const filterTime = request.incomingEpoch === undefined ? 0 : request.incomingEpoch;
        const len = wallet.incomingTransfers.length;
        incomingTransfers = wallet.incomingTransfers.filter(t => t.confirmed > filterTime).map(t => ({
            value: t.value,
            bundle: t.bundle,
            confirmed: t.confirmed,
            reference: t.receiveWalletId
        }));
        wallet.incomingTransfers = wallet.incomingTransfers.filter(t => t.confirmed <= filterTime);
        if (wallet.incomingTransfers.length !== len) {
            changed = true;
        }
    }
    if (wallet && wallet.outgoingTransfers) {
        const filterTime = request.outgoingEpoch === undefined ? 0 : request.outgoingEpoch;
        const len = wallet.outgoingTransfers.length;
        outgoingTransfers = wallet.outgoingTransfers.filter(t => t.confirmed > filterTime).map(t => ({
            value: t.value,
            bundle: t.bundle,
            confirmed: t.confirmed,
            reference: t.sourceWalletId
        }));
        wallet.outgoingTransfers = wallet.outgoingTransfers.filter(t => t.confirmed <= filterTime);
        if (wallet.outgoingTransfers.length !== len) {
            changed = true;
        }
    }

    if (changed) {
        await walletService.set(wallet.id, wallet);
    }

    return {
        success: true,
        message: "OK",
        balance: wallet && wallet.balance,
        incomingTransfers: incomingTransfers,
        outgoingTransfers: outgoingTransfers
    };
}
