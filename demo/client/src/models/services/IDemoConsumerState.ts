import { IDemoPowerSlice } from "./IDemoPowerSlice";

export interface IDemoConsumerState {
    /**
     * Paid balance.
     */
    paidBalance: number;

    /**
     * Owed balance.
     */
    owedBalance: number;

    /**
     * The power slices for the producer.
     */
    powerSlices?: IDemoPowerSlice[];
}
