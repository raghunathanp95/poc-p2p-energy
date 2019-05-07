/**
 * Definition of consumer stratey state.
 */
export interface IBasicConsumerStrategyState {
    /**
     * The initial time the strategy was created.
     */
    initialTime?: number;
    /**
     * The last usage time slot.
     */
    lastUsageTime?: number;
    /**
     * Paid balance.
     */
    paidBalance?: number;
    /**
     * Owed balance.
     */
    owedBalance?: number;
}
