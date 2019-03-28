import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { IProducerOutput } from "../../models/db/grid/IProducerOutput";
import { AmazonDynamoDbService } from "../amazon/amazonDynamoDbService";
/**
 * Service to handle the producer store.
 */
export declare class ProducerStoreService extends AmazonDynamoDbService<IProducerOutput> {
    /**
     * The name of the database table.
     */
    static readonly TABLE_NAME: string;
    /**
     * Create a new instance of ProducerStoreService.
     * @param config Configuration for DB.
     */
    constructor(config: IAWSDynamoDbConfiguration);
}
