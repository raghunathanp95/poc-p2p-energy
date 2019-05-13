import { IConsumerUsageEntry } from "../db/grid/IConsumerUsageEntry";
import { IProducerOutputEntry } from "../db/grid/IProducerOutputEntry";
import { IConsumerPaymentRequestCommand } from "../mam/IConsumerPaymentRequestCommand";
import { IGridManagerState } from "../state/IGridManagerState";

/**
 * Interface definition for grid strategy for calculating outputs and payments
 */
export interface IGridStrategy<S> {
    /**
     * Initialise the state.
     * @param gridId The id of the grid.
     */
    init(gridId: string): Promise<S>;

    /**
     * Collated consumers usage.
     * @param gridId The id of the grid.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    consumers(
        gridId: string,
        consumerUsageById: { [id: string]: IConsumerUsageEntry[] },
        gridState: IGridManagerState<S>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;

            /**
             * Commands to send for each consumer.
             */
            paymentRequests: { [id: string]: IConsumerPaymentRequestCommand };
        }>;

    /**
     * Collated producer output.
     * @param gridId The id of the grid.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    producers(
        gridId: string,
        producerUsageById: { [id: string]: IProducerOutputEntry[] },
        gridState: IGridManagerState<S>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
        }>;
}
