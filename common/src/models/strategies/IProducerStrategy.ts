import { ISourceStoreOutput } from "../db/producer/ISourceStoreOutput";
import { IProducerOutputCommand } from "../mam/IProducerOutputCommand";
import { IProducerManagerState } from "../state/IProducerManagerState";

/**
 * Interface definition for producer strategy for calculating outputs and payments
 */
export interface IProducerStrategy<S> {
    /**
     * Initialise the state.
     * @param producerId The id of the producer.
     */
    init(producerId: string): Promise<S>;

    /**
     * Collated sources output.
     * @param producerId The id of the producer.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    sources(
        producerId: string,
        sourceOutputById: { [id: string]: ISourceStoreOutput[] },
        producerState: IProducerManagerState<S>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
            /**
             * New commands to output.
             */
            commands: IProducerOutputCommand[];
        }>;

    /**
     * Collated payments.
     * @param producerId The id of the producer.
     * @param producerState The current state of the producer.
     */
    payments(
        producerId: string,
        producerState: IProducerManagerState<S>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
        }>;
}
