import { ILoggingService, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IConfiguration } from "../models/IConfiguration";
import { ProducerService } from "../services/producerService";

/**
 * Initialise the producer.
 */
export async function initialise(config: IConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["init", "producer-init"]);

    loggingService.log("initialise", "Initializing");

    try {
        const producerService = ServiceFactory.get<ProducerService>("producer");
        await producerService.initialise();

        loggingService.log("initialise", "Success");
    } catch (err) {
        loggingService.error("initialise", `Failed`, err);
    }

    return loggingService.formatCapture(loggingService.stopCapture());
}
