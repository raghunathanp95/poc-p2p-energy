import { IBasicGridStrategyConsumerTotals } from "./IBasicGridStrategyConsumerTotals";
/**
 * Definition of grid stratey state.
 */
export interface IBasicGridStrategyState {
    /**
     * The seed used to generate payment addressses.
     */
    paymentSeed?: string;
    /**
     * The initial time for the state.
     */
    initialTime?: number;
    /**
     * Running costs total.
     */
    runningCostsTotal?: number;
    /**
     * Running costs received.
     */
    runningCostsReceived?: number;
    /**
     * Producer totals.
     */
    producerTotals: {
        [id: string]: {
            /**
             * Total output for the producer.
             */
            output: number;
            /**
             * Total received by the producer.
             */
            received: number;
            /**
             * Total owed to the producer.
             */
            owed: number;
        };
    };
    /**
     * Consumer totals.
     */
    consumerTotals: {
        [id: string]: IBasicGridStrategyConsumerTotals;
    };
    /**
     * Last time we checked for transfers.
     */
    lastTransferCheck: number;
    /**
     * The time of the last incoming transfer.
     */
    lastIncomingTransferTime: number;
    /**
     * The time of the last outgoing transfer.
     */
    lastOutgoingTransferTime: number;
}
