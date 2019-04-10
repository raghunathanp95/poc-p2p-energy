import { IProducerManagerState } from "p2p-energy-common/dist/models/state/IProducerManagerState";
import { IDemoPowerSlice } from "./IDemoPowerSlice";
import { IDemoSourceState } from "./IDemoSourceState";

export interface IDemoProducerState {
    /**
     * The producer manager state.
     */
    producerManagerState: IProducerManagerState;

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
