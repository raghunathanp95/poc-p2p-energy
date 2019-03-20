import { AmazonDynamoDbService, IAWSDynamoDbConfiguration } from "poc-p2p-energy-grid-common";
import { IProducerOutputPayment } from "../models/db/IProducerOutputPayment";

/**
 * Service to handle the producer store.
 */
export class ProducerOutputPaymentService extends AmazonDynamoDbService<IProducerOutputPayment> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "producerOutputPayment";

    /**
     * Create a new instance of ProducerStoreService.
     * @param config Configuration for DB.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, ProducerOutputPaymentService.TABLE_NAME, "id");
    }
}
