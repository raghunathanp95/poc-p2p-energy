import { ISourceStoreOutput } from "../db/producer/ISourceStoreOutput";
import { IProducerOutputCommand } from "../mam/IProducerOutputCommand";
import { IProducerManagerState } from "../state/IProducerManagerState";
/**
 * Interface definition for producer strategy for calculating outputs and payments
 */
export interface IProducerStrategy<S> {
    /**
     * Initialise the state.
     */
    init(): Promise<S>;
    /**
     * Collated sources output.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    sources(sourceOutputById: {
        [id: string]: ISourceStoreOutput[];
    }, producerState: IProducerManagerState<S>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
        /**
         * New commands to output.
         */
        commands: IProducerOutputCommand[];
    }>;
}
