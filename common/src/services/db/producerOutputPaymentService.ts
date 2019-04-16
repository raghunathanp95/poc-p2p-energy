import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { IProducerOutputPayment } from "../../models/db/grid/IProducerOutputPayment";
import { AmazonDynamoDbService } from "../amazon/amazonDynamoDbService";

/**
 * Service to handle the producer store.
 */
export class ProducerOutputPaymentService extends AmazonDynamoDbService<IProducerOutputPayment> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "producerOutputPayment";

    /**
     * Create a new instance of ProducerOutputPaymentService.
     * @param config Configuration for DB.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, ProducerOutputPaymentService.TABLE_NAME, "id");
    }
}
