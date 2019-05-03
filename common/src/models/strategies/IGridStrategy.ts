/**
 * Interface definition for grid strategy for calculating outputs and payments
 */
export interface IGridStrategy {
    /**
     * Process the strategy.
     */
    process(): Promise<void>;
}
