import { IConsumerUsageEntry } from "../models/db/grid/IConsumerUsageEntry";
import { IProducerOutputEntry } from "../models/db/grid/IProducerOutputEntry";
import { IGridManagerState } from "../models/state/IGridManagerState";
import { IBasicGridStrategyState } from "../models/strategies/IBasicGridStrategyState";
import { IGridStrategy } from "../models/strategies/IGridStrategy";
/**
 * Basic implementation of a grid strategy.
 */
export declare class BasicGridStrategy implements IGridStrategy<IBasicGridStrategyState> {
    /**
     * Initialise the state.
     */
    init(): Promise<IBasicGridStrategyState>;
    /**
     * Collated consumers usage.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    consumers(consumerUsageById: {
        [id: string]: IConsumerUsageEntry[];
    }, gridState: IGridManagerState<IBasicGridStrategyState>): Promise<void>;
    /**
     * Collated producer output.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    producers(producerUsageById: {
        [id: string]: IProducerOutputEntry[];
    }, gridState: IGridManagerState<IBasicGridStrategyState>): Promise<void>;
}
