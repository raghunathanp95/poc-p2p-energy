/**
 * Object definition for storing output from a producer.
 */
export interface IProducerOutputEntry {
    /**
     * The startTime for the producers output.
     */
    startTime: number;
    /**
     * The endTime for the producers output.
     */
    endTime: number;
    /**
     * The output for the producer in kWh.
     */
    output: number;
    /**
     * The price the producer would like for this output per kWh.
     */
    producerAskingPrice: number;
    /**
     * The payment address for this output.
     */
    paymentAddress: string;
    /**
     * The price the grid is actually going to pay for output per kWh.
     */
    gridActualPrice?: number;
}
