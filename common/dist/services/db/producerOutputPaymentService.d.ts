import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { IProducerOutputPayment } from "../../models/db/grid/IProducerOutputPayment";
import { AmazonDynamoDbService } from "../amazon/amazonDynamoDbService";
/**
 * Service to handle the producer store.
 */
export declare class ProducerOutputPaymentService extends AmazonDynamoDbService<IProducerOutputPayment> {
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
