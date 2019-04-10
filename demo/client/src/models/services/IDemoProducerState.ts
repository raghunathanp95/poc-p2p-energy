import { IDemoPowerSlice } from "./IDemoPowerSlice";
import { IDemoSourceState } from "./IDemoSourceState";

export interface IDemoProducerState {
    /**
     * Received balance.
     */
    receivedBalance: number;

    /**
     * Owed balance.
     */
    owedBalance: number;

    /**
     * The power slices for the producer.
     */
    powerSlices?: IDemoPowerSlice[];

    /**
     * The source states.
     */
    sourceStates: { [id: string]: IDemoSourceState };
}
