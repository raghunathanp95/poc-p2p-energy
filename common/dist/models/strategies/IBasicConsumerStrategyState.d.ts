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
     * Total usage.
     */
    usageTotal?: number;
    /**
     * Paid balance.
     */
    paidBalance?: number;
    /**
     * Outstanding balance.
     */
    outstandingBalance?: number;
    /**
     * Last payment bundle.
     */
    lastPaymentBundle?: string;
}
