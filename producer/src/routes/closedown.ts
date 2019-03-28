import { ILoggingService, IProducerServiceConfiguration, ProducerService, ServiceFactory } from "poc-p2p-energy-grid-common";

/**
 * Closedown the producer.
 */
export async function closedown(config: IProducerServiceConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["closedown", "producer-closedown"]);

    loggingService.log("closedown", "Closing Down");

    try {
        const producerService = ServiceFactory.get<ProducerService>("producer");
        await producerService.closedown();

        loggingService.log("closedown", "Success");
    } catch (err) {
        loggingService.error("closedown", `Failed`, err);
    }

    return loggingService.formatCapture(loggingService.stopCapture());
}
