import { composeAPI } from "@iota/core";
import { IAWSDynamoDbConfiguration } from "../models/config/IAWSDynamoDbConfiguration";
import { ITransaction } from "../models/db/ITransaction";
import { AmazonDynamoDbService } from "./amazonDynamoDbService";

/**
 * Service to handle the transaction cache.
 */
export class TransactionCacheService extends AmazonDynamoDbService<ITransaction> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "transactionCache";

    /**
     * Configuration to connection to tangle.
     */
    private readonly _provider: string;

    constructor(config: IAWSDynamoDbConfiguration, provider: string) {
        super(config, TransactionCacheService.TABLE_NAME, "id");
        this._provider = provider;
    }

    /**
     * Get the transaction with the given hash.
     * @param id The hash id.
     */
    public async get(id: string): Promise<ITransaction> {
        try {
            const iota: any = composeAPI({
                provider: this._provider
            });

            const getTrytesResponse = await iota.getTrytes([id]);
            if (getTrytesResponse && getTrytesResponse.length > 0) {
                return {
                    id,
                    trytes: getTrytesResponse[0]
                };
            }
        } catch (err) {
        }

        return super.get(id);
    }
}
