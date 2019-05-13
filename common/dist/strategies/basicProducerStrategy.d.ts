import { ISourceStoreOutput } from "../models/db/producer/ISourceStoreOutput";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";
import { IProducerManagerState } from "../models/state/IProducerManagerState";
import { IBasicProducerStrategyState } from "../models/strategies/IBasicProducerStrategyState";
import { IProducerStrategy } from "../models/strategies/IProducerStrategy";
/**
 * Basic implementation of a producer strategy.
 */
export declare class BasicProducerStrategy implements IProducerStrategy<IBasicProducerStrategyState> {
    /**
     * The base for timing.
     */
    private static readonly TIME_INTERVAL;
    /**
     * How long do we consider a time before item was idle.
     */
    private static readonly TIME_IDLE;
    /**
     * Initialise the state.
     */
    init(): Promise<IBasicProducerStrategyState>;
    /**
     * Collated sources output.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    sources(sourceOutputById: {
        [id: string]: ISourceStoreOutput[];
    }, producerState: IProducerManagerState<IBasicProducerStrategyState>): Promise<{
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
