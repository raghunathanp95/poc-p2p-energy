import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IProducerServiceConfiguration } from "p2p-energy-common/dist/models/config/producer/IProducerServiceConfiguration";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { ProducerService } from "p2p-energy-common/dist/services/producerService";

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
