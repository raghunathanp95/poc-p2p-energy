import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { asTransactionTrytes } from "@iota/transaction-converter";
import { IAWSDynamoDbConfiguration } from "p2p-energy-common/dist/models/config/IAWSDynamoDbConfiguration";
import { AmazonDynamoDbService } from "p2p-energy-common/dist/services/amazon/amazonDynamoDbService";
import { IWalletState } from "../models/services/IWalletState";

/**
 * Service to store wallet states in AmazonS3.
 */
export class WalletStateService extends AmazonDynamoDbService<IWalletState> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "wallet";

    /**
     * Create a new instance of WalletStateService
     * @param config The configuration.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, WalletStateService.TABLE_NAME, "seed");
    }

    /**
     * Send any pending transfers.
     * @param loadBalancerSettings The load balancer settings.
     * @param walletId The wallet id.
     */
    public async sendTransfers(loadBalancerSettings: LoadBalancerSettings, walletId: string): Promise<void> {
        const walletState = await this.get(walletId);

        if (walletState) {
            let updated = false;

            const iota = composeAPI(
                loadBalancerSettings
            );

            try {
                // If there is a pending transaction see if it has completed
                if (walletState.pendingTransaction) {
                    const tips = await iota.getTips();
                    const states = await iota.getInclusionStates([walletState.pendingTransaction], tips);
                    if (states && states.length > 0) {
                        if (states[0]) {
                            walletState.pendingTransaction = undefined;
                            updated = true;
                        }
                    }
                }

                // If there is no pending transaction send the next one
                if (!walletState.pendingTransaction && walletState.pendingTransfers.length > 0) {
                    const transfers = walletState.pendingTransfers.shift();

                    await iota.sendTrytes(asTransactionTrytes(transfers), undefined, undefined);

                    walletState.pendingTransaction = transfers[0].hash;

                    updated = true;
                }
            } catch (err) {
                console.error(err);
            }

            if (updated) {
                await this.set(walletId, walletState);
            }
        }
    }
}
