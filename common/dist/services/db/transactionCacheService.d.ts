import { LoadBalancerSettings } from "@iota/client-load-balancer";
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
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
    /**
     * Create a new instance of TransactionCacheService.
     * @param config The configuration to use.
     * @param loadBalancerSettings Load balancer settings for communications.
     */
    constructor(config: IAWSDynamoDbConfiguration, loadBalancerSettings: LoadBalancerSettings);
    /**
     * Get the transaction with the given hash.
     * @param id The hash id.
     */
    get(id: string): Promise<ITransaction>;
}
