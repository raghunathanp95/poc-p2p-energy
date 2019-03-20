import { AmazonS3RegistrationService, AmazonS3Service, BundleCacheService, ILoggingService, ServiceFactory, TransactionCacheService } from "poc-p2p-energy-grid-common";
import { IConfiguration } from "../models/IConfiguration";
import { ProducerOutputPaymentService } from "../services/producerOutputPaymentService";
import { ProducerStoreService } from "../services/producerStoreService";

/**
 * Initialise the database.
 */
export async function init(config: IConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["init", "dynamoDb", "s3"]);
    loggingService.log("init", "Initializing");

    try {
        if (config.dynamoDbConnection) {
            await new BundleCacheService(config.dynamoDbConnection, config.node.provider)
                .createTable(loggingService);
            await new TransactionCacheService(config.dynamoDbConnection, config.node.provider)
                .createTable(loggingService);
            await new AmazonS3RegistrationService(config.dynamoDbConnection)
                .createTable(loggingService);
            await new ProducerStoreService(config.dynamoDbConnection)
                .createTable(loggingService);
            await new ProducerOutputPaymentService(config.dynamoDbConnection)
                .createTable(loggingService);
        }

        if (config.s3Connection) {
            await new AmazonS3Service(config.s3Connection, "storage")
                .createBucket(loggingService);
        }

        loggingService.log("init", `Initialization Complete`);
    } catch (err) {
        loggingService.error("init", `Initialization Failed`, err);
    }

    return loggingService.formatCapture(loggingService.stopCapture());
}
