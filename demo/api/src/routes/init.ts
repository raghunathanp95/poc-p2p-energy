import { AmazonS3Service, IGridServiceConfiguration, ILoggingService, ServiceFactory } from "poc-p2p-energy-grid-common";

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
