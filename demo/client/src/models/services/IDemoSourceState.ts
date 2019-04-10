import { ISourceManagerState } from "p2p-energy-common/dist/models/state/ISourceManagerState";
import { IDemoPowerSlice } from "./IDemoPowerSlice";

export interface IDemoSourceState {
    /**
     * The source manager state.
     */
    sourceManagerState: ISourceManagerState;

    /**
     * The power slices from the source.
     */
    powerSlices?: IDemoPowerSlice[];
}
