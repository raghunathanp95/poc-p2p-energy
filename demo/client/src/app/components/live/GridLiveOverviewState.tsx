
export interface GridLiveOverviewState {
    /**
     * Running costs total.
     */
    runningCostsTotal: string;

    /**
     * Running costs received.
     */
    runningCostsReceived: string;

    /**
     * Producer output.
     */
    producersTotalOutput: string;

    /**
     * Producer received.
     */
    producersTotalReceived: string;

    /**
     * Producer owed.
     */
    producersTotalOwed: string;

    /**
     * Consumer usage.
     */
    consumersTotalUsage: string;

    /**
     * Consumer paid.
     */
    consumersTotalPaid: string;

    /**
     * Consumer owed.
     */
    consumersTotalOutstanding: string;
}
