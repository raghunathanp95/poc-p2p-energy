import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { IBundle } from "../../models/db/IBundle";
import { AmazonDynamoDbService } from "../amazon/amazonDynamoDbService";
/**
 * Service to handle the bundle cache.
 */
export declare class BundleCacheService extends AmazonDynamoDbService<IBundle> {
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
     * Get the bundle with the given hash.
     * @param id The hash id of the bundle.
     */
    get(id: string): Promise<IBundle>;
}
