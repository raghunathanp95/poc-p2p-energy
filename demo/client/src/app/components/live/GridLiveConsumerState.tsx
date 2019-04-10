import { IDemoConsumerState } from "../../../models/services/IDemoConsumerState";

export interface GridLiveConsumerState {
    /**
     * The consumer state.
     */
    consumerState?: IDemoConsumerState;

    /**
     * Are the details expanded.
     */
    isExpanded: boolean;
}
