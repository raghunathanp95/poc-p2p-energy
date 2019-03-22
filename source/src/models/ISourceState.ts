import { IMamChannelConfiguration } from "poc-p2p-energy-grid-common";

/**
 * Definition of source state.
 */
export interface ISourceState {
    /**
     * The channel configuration for the source.
     */
    channel?: IMamChannelConfiguration;

    /**
     * The last output time slot.
     */
    lastOutputTime: number;
}
