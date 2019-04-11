import { IConsumerManagerState } from "p2p-energy-common/dist/models/state/IConsumerManagerState";
import { IDemoPowerSlice } from "./IDemoPowerSlice";

export interface IDemoConsumerState {
    /**
     * The consumer manager state.
     */
    consumerManagerState: IConsumerManagerState;

    /**
     * Paid balance.
     */
    paidBalance?: number;

    /**
     * Owed balance.
     */
    owedBalance?: number;

    /**
     * The power slices for the producer.
     */
    powerSlices?: IDemoPowerSlice[];
}
