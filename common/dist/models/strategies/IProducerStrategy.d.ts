import { ISourceStoreOutput } from "../db/producer/ISourceStoreOutput";
/**
 * Interface definition for producer strategy for calculating outputs and payments
 */
export interface IProducerStrategy {
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
