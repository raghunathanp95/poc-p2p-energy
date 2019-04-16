import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IGridServiceConfiguration } from "p2p-energy-common/dist/models/config/grid/IGridServiceConfiguration";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { AmazonS3RegistrationService } from "p2p-energy-common/dist/services/amazon/amazonS3RegistrationService";
import { AmazonS3Service } from "p2p-energy-common/dist/services/amazon/amazonS3Service";
import { BundleCacheService } from "p2p-energy-common/dist/services/db/bundleCacheService";
import { ConsumerUsageStoreService } from "p2p-energy-common/dist/services/db/consumerUsageStoreService";
import { ProducerOutputPaymentService } from "p2p-energy-common/dist/services/db/producerOutputPaymentService";
import { ProducerOutputStoreService } from "p2p-energy-common/dist/services/db/producerOutputStoreService";
import { TransactionCacheService } from "p2p-energy-common/dist/services/db/transactionCacheService";

/**
 * Initialise the components for the Grid.
 */
export async function init(config: IGridServiceConfiguration): Promise<string[]> {
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
            await new ProducerOutputStoreService(config.dynamoDbConnection)
                .createTable(loggingService);
            await new ConsumerUsageStoreService(config.dynamoDbConnection)
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
