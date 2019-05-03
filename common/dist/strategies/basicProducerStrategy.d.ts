import { ISourceStoreOutput } from "../models/db/producer/ISourceStoreOutput";
import { IProducerStrategy } from "../models/strategies/IProducerStrategy";
/**
 * Basic implementation of a producer strategy.
 */
export declare class BasicProducerStrategy implements IProducerStrategy {
    /**
     * Service to log output to.
     */
    private readonly _loggingService;
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor();
    /**
     * Calculate the price for an output command.
     * @param startTime The start time of the output value.
     * @param endTime The end time of the output value.
     * @param combinedValue The combined value of the sources for the time slice.
     */
    price(startTime: number, endTime: number, combinedValue: number): Promise<number>;
    /**
     * Calculate the address index to use for the output command.
     * @param producerCreated The time the producer was created.
     * @param outputTime The start time of the current output value.
     */
    addressIndex(producerCreated: number, outputTime: number): Promise<number>;
    /**
     * Archive the source output if you need to.
     * @param sourceId The is of the source.
     * @param archiveOutputs The source output values to archive.
     */
    archiveSourceOutput(sourceId: string, archiveOutputs: ISourceStoreOutput[]): Promise<void>;
}
