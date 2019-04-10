import { IDemoGridState } from "../../../models/services/IDemoGridState";

export interface GridLiveContainerState {
    /**
     * The global wallet balance used by the demo.
     */
    walletBalance: string;

    /**
     * The grid state.
     */
    gridState?: IDemoGridState;
}
