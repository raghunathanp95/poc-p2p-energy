import { IAWSDynamoDbConfiguration } from "p2p-energy-common/dist/models/config/IAWSDynamoDbConfiguration";
import { AmazonDynamoDbService } from "p2p-energy-common/dist/services/amazon/amazonDynamoDbService";
import { IWalletState } from "../models/services/IWalletState";

/**
 * Service to store wallet states in AmazonS3.
 */
export class WalletStateService extends AmazonDynamoDbService<IWalletState> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "wallet";

    /**
     * Create a new instance of WalletStateService
     * @param config The configuration.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, WalletStateService.TABLE_NAME, "seed");
    }
}
