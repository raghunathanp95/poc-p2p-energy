export interface GridLiveProducerState {
    /**
     * Are the details expanded.
     */
    isExpanded: boolean;

    /**
     * Received balance.
     */
    receivedBalance: number;

    /**
     * Owed balance.
     */
    owedBalance: number;

    /**
     * The data labels for the graph.
     */
    graphLabels: string[];

    /**
     * The data series for the graph.
     */
    graphSeries: number[][];
}
