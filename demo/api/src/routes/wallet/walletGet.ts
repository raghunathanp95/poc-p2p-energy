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

    const incomingEpoch: number = `${request.incomingEpoch}` === "undefined" ? undefined : +request.incomingEpoch;
    const outgoingEpoch: number = `${request.outgoingEpoch}` === "undefined" ? undefined : +request.outgoingEpoch;

    let changed = false;
    let incomingTransfers;
    let outgoingTransfers;

    if (wallet && wallet.incomingTransfers && incomingEpoch !== undefined) {
        incomingTransfers = wallet.incomingTransfers
            .filter(t => t.confirmed > incomingEpoch)
            .map(t => ({
                value: t.value,
                bundle: t.bundle,
                confirmed: t.confirmed,
                reference: t.payload.from
            }));
        if (incomingTransfers.length > 0) {
            wallet.incomingTransfers = wallet.incomingTransfers.filter(t => t.confirmed <= incomingEpoch);
            changed = true;
        }
    }
    if (wallet && wallet.outgoingTransfers && outgoingEpoch !== undefined) {
        outgoingTransfers = wallet.outgoingTransfers
            .filter(t => t.confirmed > outgoingEpoch)
            .map(t => ({
                value: t.value,
                bundle: t.bundle,
                confirmed: t.confirmed,
                reference: t.payload.to
            }));
        if (outgoingTransfers.length > 0) {
            wallet.outgoingTransfers = wallet.outgoingTransfers.filter(t => t.confirmed <= outgoingEpoch);
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
        incomingTransfers,
        outgoingTransfers
    };
}
