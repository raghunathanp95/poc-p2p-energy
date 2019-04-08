import { IPowerSlice } from "../../models/api/IPowerSlice";

export interface GridLiveState {
    /**
     * The power slices.
     */
    powerSlices: { [id: string]: IPowerSlice[]};
}
