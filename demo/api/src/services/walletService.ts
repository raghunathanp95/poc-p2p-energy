import { IAWSDynamoDbConfiguration } from "p2p-energy-common/dist/models/config/IAWSDynamoDbConfiguration";
import { AmazonDynamoDbService } from "p2p-energy-common/dist/services/amazon/amazonDynamoDbService";
import { IWallet } from "../models/services/IWallet";

/**
 * Service to store wallet states in AmazonS3.
 */
export class WalletService extends AmazonDynamoDbService<IWallet> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "wallet";

    /**
     * Create a new instance of WalletService
     * @param config The configuration.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, WalletService.TABLE_NAME, "id");
    }
}
