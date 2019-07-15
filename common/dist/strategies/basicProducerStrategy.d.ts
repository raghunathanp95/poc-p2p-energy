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
     * Logging service.
     */
    private readonly _loggingService;
    /**
     * Wallet service.
     */
    private readonly _walletService;
    /**
     * Create a new instance of BasicGridStrategy.
     */
    constructor();
    /**
     * Initialise the state.
     * @param producerId The id of the producer.
     * @returns The producer state.
     */
    init(producerId: string): Promise<IBasicProducerStrategyState>;
    /**
     * Collated sources output.
     * @param producerId The id of the producer.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    sources(producerId: string, sourceOutputById: {
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
    /**
     * Collated payments.
     * @param producerId The id of the producer.
     * @param producerState The current state of the producer.
     * @returns If the state was updated.
     */
    payments(producerId: string, producerState: IProducerManagerState<IBasicProducerStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
    }>;
}
