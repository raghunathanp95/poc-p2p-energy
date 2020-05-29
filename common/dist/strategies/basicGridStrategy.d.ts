import { IGridConfiguration } from "../models/config/grid/IGridConfiguration";
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
     * @returns The state of the grid.
     */
    initState(): Promise<IBasicGridStrategyState>;
    /**
     * Collated consumers usage.
     * @param config The id of the grid.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     * @returns If the state has been updated and any payment requests to send.
     */
    consumers(config: IGridConfiguration, consumerUsageById: {
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
     * @param config The config of the grid.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     * @returns If the state was updated.
     */
    producers(config: IGridConfiguration, producerUsageById: {
        [id: string]: IProducerOutputEntry[];
    }, gridState: IGridManagerState<IBasicGridStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
    }>;
    /**
     * Collated payments.
     * @param config The config of the grid.
     * @param gridState The current state of the grid.
     * @returns If the state was updated.
     */
    payments(config: IGridConfiguration, gridState: IGridManagerState<IBasicGridStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
    }>;
    /**
     * Pay the producers using their percentage contribution
     * @param gridId The id of the grid.
     * @param gridState The current state of the grid.
     */
    private payProducers;
    /**
     * Update the usage for the consumer.
     * @param gridId The id of the grid.
     * @param consumerTotals The total for the consumer.
     * @param newUsage Additional usage for the consumer.
     * @returns A new payment request command or nothing.
     */
    private updateConsumerUsage;
}
