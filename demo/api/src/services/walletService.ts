import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { Inputs } from "@iota/core/typings/types";
import { IAWSDynamoDbConfiguration } from "p2p-energy-common/dist/models/config/IAWSDynamoDbConfiguration";
import { AmazonDynamoDbService } from "p2p-energy-common/dist/services/amazon/amazonDynamoDbService";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import { IDemoWallet } from "../models/services/IDemoWallet";

/**
 * Service to store wallet states in AmazonS3.
 */
export class WalletService extends AmazonDynamoDbService<IDemoWallet> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "wallet";

    /**
     * Create a new instance of WalletService
     * @param config The configuration.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, WalletService.TABLE_NAME, "id");
    }

    /**
     * Get the data for the wallet.
     * @param id The id for the wallet.
     * @param seed The seed to create the wallet with.
     * @param loadBalancerSettings The load balancer settings for communications.
     */
    public async getOrCreate(
        id: string,
        seed: string | undefined,
        loadBalancerSettings: LoadBalancerSettings): Promise<IDemoWallet> {
        let wallet = await super.get(id);

        if (!wallet) {
            try {
                const iota = composeAPI(loadBalancerSettings);

                const createSeed = seed || TrytesHelper.generateHash(81);
                let balance = 0;
                let startIndex = 0;
                let lastIndex = 0;

                if (id === "global") {
                    const inputsResponse: Inputs = await iota.getInputs(createSeed, { start: 20 });
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
                    id,
                    seed: createSeed,
                    balance,
                    startIndex,
                    lastIndex
                };
                await super.set(wallet.id, wallet);

            } catch (err) {
            }
        }

        return wallet;
    }
}
