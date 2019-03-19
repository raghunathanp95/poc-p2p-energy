import { AmazonS3RegistrationService, AmazonS3Service, BundleCacheService, ILoggingService, ServiceFactory, TransactionCacheService } from "poc-p2p-energy-grid-common";
import { IConfiguration } from "../models/IConfiguration";
import { ProducerStoreService } from "../services/producerStoreService";

/**
 * Initialise the database.
 */
export async function init(config: IConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["init", "dynamoDb", "s3"]);
    loggingService.log("init", "Initializing");

    try {
        await new BundleCacheService(config.dynamoDbConnection, config.node.provider).createTable(loggingService);
        await new TransactionCacheService(config.dynamoDbConnection, config.node.provider).createTable(loggingService);
        await new AmazonS3RegistrationService(config.dynamoDbConnection).createTable(loggingService);
        await new AmazonS3Service(config.s3Connection, config.storageBucket).createBucket(loggingService);
        await new ProducerStoreService(config.dynamoDbConnection).createTable(loggingService);

        loggingService.log("init", `Initialization Complete`);
    } catch (err) {
        loggingService.error("init", `Initialization Failed`, err);
    }

    return loggingService.formatCapture(loggingService.stopCapture());
}
