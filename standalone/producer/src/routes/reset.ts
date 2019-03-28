import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IProducerServiceConfiguration } from "p2p-energy-common/dist/models/config/producer/IProducerServiceConfiguration";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { ProducerService } from "p2p-energy-common/dist/services/producerService";
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
