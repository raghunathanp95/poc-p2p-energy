import { IDemoSourceState } from "../../../models/services/IDemoSourceState";

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
     * The selected sources for the graph.
     */
    selectedSources: { [id: string]: IDemoSourceState };

    /**
     * The data labels for the producer graph.
     */
    producerGraphLabels: string[];

    /**
     * The data series for the producer graph.
     */
    producerGraphSeries: number[];

    /**
     * The data labels for the source graph.
     */
    sourceGraphLabels: string[];

    /**
     * The data series for the source graph.
     */
    sourceGraphSeries: number[][];
}
