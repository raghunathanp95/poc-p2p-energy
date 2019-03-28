import { IMamCommand } from "./IMamCommand";
export interface IProducerOutputCommand extends IMamCommand {
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
}
