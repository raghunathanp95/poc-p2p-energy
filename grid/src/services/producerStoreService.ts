import { AmazonDynamoDbService, IAWSDynamoDbConfiguration } from "poc-p2p-energy-grid-common";
import { IProducerStore } from "../models/db/IProducerStore";

/**
 * Service to handle the producer store.
 */
export class ProducerStoreService extends AmazonDynamoDbService<IProducerStore> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "producerStore";

    /**
     * Create a new instance of ProducerStoreService.
     * @param config Configuration for DB.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, ProducerStoreService.TABLE_NAME, "id");
    }
}
