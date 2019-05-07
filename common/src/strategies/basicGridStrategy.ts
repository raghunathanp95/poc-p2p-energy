import { IConsumerUsageEntry } from "../models/db/grid/IConsumerUsageEntry";
import { IProducerOutputEntry } from "../models/db/grid/IProducerOutputEntry";
import { IGridManagerState } from "../models/state/IGridManagerState";
import { IBasicGridStrategyState } from "../models/strategies/IBasicGridStrategyState";
import { IGridStrategy } from "../models/strategies/IGridStrategy";

/**
 * Basic implementation of a grid strategy.
 */
export class BasicGridStrategy implements IGridStrategy<IBasicGridStrategyState> {
    /**
     * Initialise the state.
     */
    public async init(): Promise<IBasicGridStrategyState> {
        return {
            runningCostsBalance: 0,
            producerPaidBalance: 0,
            producerOwedBalance: 0,
            consumerOwedBalance: 0,
            consumerReceivedBalance: 0
        };
    }

    /**
     * Collated consumers usage.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    public async consumers(
        consumerUsageById: { [id: string]: IConsumerUsageEntry[] },
        gridState: IGridManagerState<IBasicGridStrategyState>):
        Promise<void> {
    }

    /**
     * Collated producer output.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    public async producers(
        producerUsageById: { [id: string]: IProducerOutputEntry[] },
        gridState: IGridManagerState<IBasicGridStrategyState>): Promise<void> {
    }
}
