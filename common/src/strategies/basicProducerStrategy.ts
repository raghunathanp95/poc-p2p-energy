import { ServiceFactory } from "../factories/serviceFactory";
import { ISourceStoreOutput } from "../models/db/producer/ISourceStoreOutput";
import { ILoggingService } from "../models/services/ILoggingService";
import { IProducerStrategy } from "../models/strategies/IProducerStrategy";

/**
 * Basic implementation of a producer strategy.
 */
export class BasicProducerStrategy implements IProducerStrategy {
    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor() {
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Calculate the price for an output command.
     * @param startTime The start time of the output value.
     * @param endTime The end time of the output value.
     * @param combinedValue The combined value of the sources for the time slice.
     */
    public async price(startTime: number, endTime: number, combinedValue: number): Promise<number> {
        // Calculate a cost for the producer output slice
        // You could base this on your own costs, time of day, value etc
        return 10;
    }

    /**
     * Calculate the address index to use for the output command.
     * @param producerCreated The time the producer was created.
     * @param outputTime The start time of the current output value.
     */
    public async addressIndex(producerCreated: number, outputTime: number): Promise<number> {
        // Calculate a payment address index to use based on the time, you could just always increment
        // but for this example we will use a new payment address every hour
        return Math.floor((outputTime - producerCreated) / 3600000);
    }

    /**
     * Archive the source output if you need to.
     * @param sourceId The is of the source.
     * @param archiveOutputs The source output values to archive.
     */
    public async archiveSourceOutput(sourceId: string, archiveOutputs: ISourceStoreOutput[]): Promise<void> {
        // Source outputs are discarded when they are collated (still in mam stream)
        // but you can archive the used blocks if required in this callback
        this._loggingService.log("demo-grid-manager", `Archive source outputs '${sourceId}'`, archiveOutputs);
    }
}
