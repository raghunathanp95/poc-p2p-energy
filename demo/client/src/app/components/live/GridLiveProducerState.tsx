export interface GridLiveProducerState {
    /**
     * The mam root.
     */
    mamRoot?: string;

    /**
     * The mam sideKey.
     */
    sideKey?: string;

    /**
     * The received balance.
     */
    receivedBalance: string;

    /**
     * Owed balance.
     */
    owedBalance: string;

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
