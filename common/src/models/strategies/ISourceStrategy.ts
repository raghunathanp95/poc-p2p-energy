import { ISourceOutputCommand } from "../../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../../models/state/ISourceManagerState";

/**
 * Interface definition for source strategy for calculating outputs
 */
export interface ISourceStrategy<S> {
    /**
     * Initialise the state.
     */
    init(): Promise<S>;

    /**
     * Gets the output values.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    value(sourceState: ISourceManagerState<S>): Promise<ISourceOutputCommand[]>;
}
