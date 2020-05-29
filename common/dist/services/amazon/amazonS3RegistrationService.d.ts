import { IAWSDynamoDbConfiguration } from "../../models/config/IAWSDynamoDbConfiguration";
import { IRegistration } from "../../models/services/registration/IRegistration";
import { AmazonDynamoDbService } from "./amazonDynamoDbService";
/**
 * Service to store registrations in AmazonS3.
 */
export declare class AmazonS3RegistrationService extends AmazonDynamoDbService<IRegistration> {
    /**
     * The name of the database table.
     */
    static readonly TABLE_NAME: string;
    /**
     * Create a new instance of RegistrationService
     * @param config The configuration.
     */
    constructor(config: IAWSDynamoDbConfiguration);
}
