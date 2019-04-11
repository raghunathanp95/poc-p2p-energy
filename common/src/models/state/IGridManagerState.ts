/**
 * Definition of grid state.
 */
export interface IGridManagerState {
    /**
     * The seed used to generate payment addressses.
     */
    paymentSeed: string;

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
