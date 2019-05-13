import { IConsumerUsageCommand } from "../../models/mam/IConsumerUsageCommand";
import { IConsumerManagerState } from "../../models/state/IConsumerManagerState";
import { IConsumerPaymentRequestCommand } from "../mam/IConsumerPaymentRequestCommand";
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
    usage(consumerState: IConsumerManagerState<S>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
        /**
         * New commands to output.
         */
        commands: IConsumerUsageCommand[];
    }>;
    /**
     * Processes payment requests.
     * @param consumerState The state for the manager calling the strategy
     * @param paymentRequests Payment requests to process.
     */
    paymentRequests(consumerState: IConsumerManagerState<S>, paymentRequests: IConsumerPaymentRequestCommand[]): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
    }>;
}
