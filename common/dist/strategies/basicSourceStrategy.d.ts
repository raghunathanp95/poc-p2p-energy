import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../models/state/ISourceManagerState";
import { IBasicSourceStrategyState } from "../models/strategies/IBasicSourceStrategyState";
import { ISourceStrategy } from "../models/strategies/ISourceStrategy";
/**
 * Basic implementation of a source strategy.
 */
export declare class BasicSourceStrategy implements ISourceStrategy<IBasicSourceStrategyState> {
    /**
     * Initialise the state.
     */
    init(): Promise<IBasicSourceStrategyState>;
    /**
     * Gets the output values.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    value(sourceState: ISourceManagerState<IBasicSourceStrategyState>): Promise<ISourceOutputCommand[]>;
}
