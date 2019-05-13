import { IConsumerUsageEntry } from "../models/db/grid/IConsumerUsageEntry";
import { IProducerOutputEntry } from "../models/db/grid/IProducerOutputEntry";
import { IConsumerPaymentRequestCommand } from "../models/mam/IConsumerPaymentRequestCommand";
import { IGridManagerState } from "../models/state/IGridManagerState";
import { IBasicGridStrategyState } from "../models/strategies/IBasicGridStrategyState";
import { IGridStrategy } from "../models/strategies/IGridStrategy";
/**
 * Basic implementation of a grid strategy.
 */
export declare class BasicGridStrategy implements IGridStrategy<IBasicGridStrategyState> {
    /**
     * Initialise the state.
     * @param gridId The id of the grid.
     */
    init(gridId: string): Promise<IBasicGridStrategyState>;
    /**
     * Collated consumers usage.
     * @param gridId The id of the grid.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    consumers(gridId: string, consumerUsageById: {
        [id: string]: IConsumerUsageEntry[];
    }, gridState: IGridManagerState<IBasicGridStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
        /**
         * Commands to send for each consumer.
         */
        paymentRequests: {
            [id: string]: IConsumerPaymentRequestCommand;
        };
    }>;
    /**
     * Collated producer output.
     * @param gridId The id of the grid.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    producers(gridId: string, producerUsageById: {
        [id: string]: IProducerOutputEntry[];
    }, gridState: IGridManagerState<IBasicGridStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
    }>;
    /**
     * Update the usage for the consumer.
     * @param gridId The id of the grid.
     * @param paymentAddress The payment address for the grid.
     * @param consumerTotals The total for the consumer.
     * @param newUsage Additional usage for the consumer.
     * @returns A new payment request command or nothing.
     */
    private updateConsumerUsage;
}
