/**
 * Definition of producer strategy state.
 */
export interface IBasicProducerStrategyState {
    /**
     * The initial time the strategy was created.
     */
    initialTime?: number;
    /**
     * The time of the last output command.
     */
    lastOutputTime?: number;
    /**
     * Total output.
     */
    outputTotal?: number;
    /**
     * Received balance.
     */
    receivedBalance?: number;
    /**
     * Owed balance.
     */
    owedBalance?: number;
}
