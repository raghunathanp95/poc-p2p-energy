import { IConsumerUsageCommand } from "../../models/mam/IConsumerUsageCommand";
import { IConsumerManagerState } from "../../models/state/IConsumerManagerState";

/**
 * Interface definition for consumer strategy for calculating usage.
 */
export interface IConsumerStrategy<S> {
    /**
     * Initialise the state.
     */
    init(): Promise<S>;

    /**
     * Gets the usage values.
     * @param consumerState The state for the manager calling the strategy
     * @returns List of usage commands.
     */
    usage(consumerState: IConsumerManagerState<S>): Promise<IConsumerUsageCommand[]>;
}
