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
            runningCostsTotal: 0,
            runningCostsReceived: 0,
            producerTotals: {},
            consumerTotals: {}
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
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
        }> {

        let updatedState = false;

        for (const consumerId in consumerUsageById) {
            if (!gridState.strategyState.consumerTotals[consumerId]) {
                gridState.strategyState.consumerTotals[consumerId] = {
                    usage: 0,
                    outstanding: 0,
                    paid: 0
                };
            }

            updatedState = true;
            gridState.strategyState.consumerTotals[consumerId].usage +=
                consumerUsageById[consumerId].reduce((a, b) => a + b.usage, 0);

            consumerUsageById[consumerId] = [];
        }

        return {
            updatedState
        };
    }

    /**
     * Collated producer output.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    public async producers(
        producerUsageById: { [id: string]: IProducerOutputEntry[] },
        gridState: IGridManagerState<IBasicGridStrategyState>): Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
        }> {

        let updatedState = false;

        for (const producerId in producerUsageById) {
            if (!gridState.strategyState.producerTotals[producerId]) {
                gridState.strategyState.producerTotals[producerId] = {
                    output: 0,
                    owed: 0,
                    received: 0
                };
            }

            updatedState = true;
            gridState.strategyState.producerTotals[producerId].output +=
                producerUsageById[producerId].reduce((a, b) => a + b.output, 0);

            producerUsageById[producerId] = [];
        }

        return {
            updatedState
        };
    }
}
