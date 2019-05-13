import { ISourceOutputCommand } from "../../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../../models/state/ISourceManagerState";

/**
 * Interface definition for source strategy for calculating outputs
 */
export interface ISourceStrategy<S> {
    /**
     * Initialise the state.
     * @param sourceId The id of the source.
     */
    init(sourceId: string): Promise<S>;

    /**
     * Gets the output values.
     * @param sourceId The id of the source.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    value(sourceId: string, sourceState: ISourceManagerState<S>): Promise<{
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
