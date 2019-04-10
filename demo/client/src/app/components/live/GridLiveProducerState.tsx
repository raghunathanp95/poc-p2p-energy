import { IDemoProducerState } from "../../../models/services/IDemoProducerState";

export interface GridLiveProducerState {
    /**
     * The producer state.
     */
    producerState?: IDemoProducerState;

    /**
     * Are the details expanded.
     */
    isExpanded: boolean;

    /**
     * The data labels for the graph.
     */
    graphLabels: string[];

    /**
     * The data series for the graph.
     */
    graphSeries: number[][];
}
