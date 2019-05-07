/**
 * Definition of grid state.
 */
export interface IGridManagerState<S> {
    /**
     * The seed used to generate payment addressses.
     */
    paymentSeed: string;
    /**
     * The state for the strategy.
     */
    strategyState?: S;
}
