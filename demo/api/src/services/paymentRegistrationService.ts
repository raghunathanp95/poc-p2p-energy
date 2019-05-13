import { IAWSDynamoDbConfiguration } from "p2p-energy-common/dist/models/config/IAWSDynamoDbConfiguration";
import { AmazonDynamoDbService } from "p2p-energy-common/dist/services/amazon/amazonDynamoDbService";
import { IPaymentRegistration } from "../models/services/IPaymentRegistration";

/**
 * Service to payment entities states in AmazonS3.
 */
export class PaymentRegistrationService extends AmazonDynamoDbService<IPaymentRegistration> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "payment-registrations";

    /**
     * Create a new instance of PaymentRegistrationService
     * @param config The configuration.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, PaymentRegistrationService.TABLE_NAME, "id");
    }
}
