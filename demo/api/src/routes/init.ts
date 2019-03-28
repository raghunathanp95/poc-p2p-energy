import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IGridServiceConfiguration } from "p2p-energy-common/dist/models/config/grid/IGridServiceConfiguration";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { AmazonS3Service } from "p2p-energy-common/dist/services/amazon/amazonS3Service";

/**
 * Initialise the components for the demo api.
 */
export async function init(config: IGridServiceConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["init", "s3"]);
    loggingService.log("init", "Initializing");

    try {
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
