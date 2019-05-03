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
    constructor(config: IAWSDynamoDbConfiguration);
}
