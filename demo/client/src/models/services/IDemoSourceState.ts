import { ISourceOutputCommand } from "p2p-energy-common/dist/models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "p2p-energy-common/dist/models/state/ISourceManagerState";

export interface IDemoSourceState {
    /**
     * The source manager state.
     */
    sourceManagerState: ISourceManagerState;

    /**
     * The output commands from the source.
     */
    outputCommands: ISourceOutputCommand[];
}
