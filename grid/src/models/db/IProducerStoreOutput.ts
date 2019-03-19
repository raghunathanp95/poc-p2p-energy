/**
 * Object definition for storing output from a producer.
 */
export interface IProducerStoreOutput {
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
    askingPrice: number;

    /**
     * The payment address for this output.
     */
    paymentAddress: string;

    /**
     * The actual price the producer was paid for this output per kWh.
     */
    actualPrice?: number;

    /**
     * The payment bundle for the payment.
     */
    paymentBundle?: string;
}
