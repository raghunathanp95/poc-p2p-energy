/**
 * Definition of source stratey state.
 */
export interface IBasicSourceStrategyState {
    /**
     * The initial time the strategy was created.
     */
    initialTime?: number;
    /**
     * The time of the last output command.
     */
    lastOutputTime?: number;
}
