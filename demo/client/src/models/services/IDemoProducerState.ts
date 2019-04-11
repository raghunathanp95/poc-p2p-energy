import { IProducerManagerState } from "p2p-energy-common/dist/models/state/IProducerManagerState";
import { IDemoPowerSlice } from "./IDemoPowerSlice";

export interface IDemoProducerState {
    /**
     * The producer manager state.
     */
    producerManagerState?: IProducerManagerState;

    /**
     * The power slices for the producer.
     */
    powerSlices?: IDemoPowerSlice[];
}
