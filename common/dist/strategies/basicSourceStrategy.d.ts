import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../models/state/ISourceManagerState";
import { IBasicSourceStrategyState } from "../models/strategies/IBasicSourceStrategyState";
import { ISourceStrategy } from "../models/strategies/ISourceStrategy";
/**
 * Basic implementation of a source strategy.
 */
export declare class BasicSourceStrategy implements ISourceStrategy<IBasicSourceStrategyState> {
    /**
     * The base for timing.
     */
    private static readonly TIME_BASIS;
    /**
     * How long do we consider a time before item was idle.
     */
    private static readonly TIME_IDLE;
    /**
     * Initialise the state.
     * @param sourceId The id of the source.
     */
    init(sourceId: string): Promise<IBasicSourceStrategyState>;
    /**
     * Gets the output values.
     * @param sourceId The id of the source.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    value(sourceId: string, sourceState: ISourceManagerState<IBasicSourceStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
        /**
         * New commands to output.
         */
        commands: ISourceOutputCommand[];
    }>;
}
