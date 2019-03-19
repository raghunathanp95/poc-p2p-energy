import { ILoggingService, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IConfiguration } from "../models/IConfiguration";
import { ProducerService } from "../services/producerService";

/**
 * Simulate a snapshot the producer.
 */
export async function reset(config: IConfiguration): Promise<string[]> {
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
