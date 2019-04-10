import { IDemoConsumerState } from "./IDemoConsumerState";
import { IDemoProducerState } from "./IDemoProducerState";

export interface IDemoGridState {
    /**
     * Running costs balance.
     */
    runningCostsBalance: number;

    /**
     * Producer paid balance.
     */
    producerPaidBalance: number;

    /**
     * Producer owed balance.
     */
    producerOwedBalance: number;

    /**
     * Consumer owed balance.
     */
    consumerOwedBalance: number;

    /**
     * Consumer recieved balance.
     */
    consumerReceivedBalance: number;

    /**
     * The producer states.
     */
    producerStates: { [id: string]: IDemoProducerState };

    /**
     * The consumer states.
     */
    consumerStates: { [id: string]: IDemoConsumerState };
}
