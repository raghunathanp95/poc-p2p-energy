/**
 * Definition of grid stratey state.
 */
export interface IBasicGridStrategyState {
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
        }
    };

    /**
     * Consumer totals.
     */
    consumerTotals: {
        [id: string]: {
            /**
             * Total usage for the consumer.
             */
            usage: number;

            /**
             * Total paid by the consumer.
             */
            paid: number;

            /**
             * Total outstanding by the consumer.
             */
            outstanding: number;
        }
    };
}
