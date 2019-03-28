import { ILoggingService, IProducerServiceConfiguration, ProducerService, ServiceFactory } from "poc-p2p-energy-grid-common";

/**
 * Simulate a snapshot the producer.
 */
export async function reset(config: IProducerServiceConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["reset", "producer-reset"]);

    loggingService.log("reset", "Resetting");
    try {
        const producerService = ServiceFactory.get<ProducerService>("producer");
        await producerService.reset();

        loggingService.log("reset", "Success");
    } catch (err) {
        loggingService.error("reset", `Failed`, err);
    }

    return loggingService.formatCapture(loggingService.stopCapture());
}
