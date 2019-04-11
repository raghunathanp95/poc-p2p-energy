
export interface GridLiveOverviewState {
    /**
     * Running costs balance.
     */
    runningCostsBalance: string;

    /**
     * Producer paid balance.
     */
    producerPaidBalance: string;

    /**
     * Producer owed balance.
     */
    producerOwedBalance: string;

    /**
     * Consumer owed balance.
     */
    consumerOwedBalance: string;

    /**
     * Consumer recieved balance.
     */
    consumerReceivedBalance: string;
}
