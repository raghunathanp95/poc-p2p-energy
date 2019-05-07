/**
 * Definition of grid stratey state.
 */
export interface IBasicGridStrategyState {
    /**
     * Running costs balance.
     */
    runningCostsBalance?: number;

    /**
     * Producer paid balance.
     */
    producerPaidBalance?: number;

    /**
     * Producer owed balance.
     */
    producerOwedBalance?: number;

    /**
     * Consumer owed balance.
     */
    consumerOwedBalance?: number;

    /**
     * Consumer recieved balance.
     */
    consumerReceivedBalance?: number;
}
