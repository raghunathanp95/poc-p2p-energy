import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IProducerServiceConfiguration } from "p2p-energy-common/dist/models/config/producer/IProducerServiceConfiguration";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { ProducerManager } from "p2p-energy-common/dist/services/producerManager";

/**
 * Initialise the producer.
 */
export async function initialise(config: IProducerServiceConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["init", "producer-init"]);

    loggingService.log("initialise", "Initializing");

    try {
        const producerService = ServiceFactory.get<ProducerManager>("producer");
        await producerService.initialise();

        loggingService.log("initialise", "Success");
    } catch (err) {
        loggingService.error("initialise", `Failed`, err);
    }

    return loggingService.formatCapture(loggingService.stopCapture());
}
