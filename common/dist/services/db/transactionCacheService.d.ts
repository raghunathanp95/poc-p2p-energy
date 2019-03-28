import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { ITransaction } from "../../models/db/ITransaction";
import { AmazonDynamoDbService } from "../amazon/amazonDynamoDbService";
/**
 * Service to handle the transaction cache.
 */
export declare class TransactionCacheService extends AmazonDynamoDbService<ITransaction> {
    /**
     * The name of the database table.
     */
    static readonly TABLE_NAME: string;
    /**
     * Configuration to connection to tangle.
     */
    private readonly _provider;
    constructor(config: IAWSDynamoDbConfiguration, provider: string);
    /**
     * Get the transaction with the given hash.
     * @param id The hash id.
     */
    get(id: string): Promise<ITransaction>;
}
