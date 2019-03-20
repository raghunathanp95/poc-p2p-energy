import { composeAPI } from "@iota/core";
import { IAWSDynamoDbConfiguration } from "../models/config/IAWSDynamoDbConfiguration";
import { IBundle } from "../models/db/IBundle";
import { AmazonDynamoDbService } from "./amazonDynamoDbService";

/**
 * Service to handle the bundle cache.
 */
export class BundleCacheService extends AmazonDynamoDbService<IBundle> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "bundleCache";

    /**
     * Configuration to connection to tangle.
     */
    private readonly _provider: string;

    constructor(config: IAWSDynamoDbConfiguration, provider: string) {
        super(config, BundleCacheService.TABLE_NAME, "id");
        this._provider = provider;
    }

    /**
     * Get the bundle with the given hash.
     * @param id The hash id of the bundle.
     */
    public async get(id: string): Promise<IBundle> {
        try {
            const iota = composeAPI({
                provider: this._provider
            });

            const findTransactionsResponse = await iota.findTransactions({ bundles: [id] });
            if (findTransactionsResponse && findTransactionsResponse.length > 0) {
                return {
                    id,
                    transactionHashes: findTransactionsResponse
                };
            }
        } catch (err) {
        }

        return super.get(id);
    }
}
