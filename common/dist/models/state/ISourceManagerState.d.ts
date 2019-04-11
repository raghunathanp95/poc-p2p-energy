import { IMamChannelConfiguration } from "../mam/IMamChannelConfiguration";
/**
 * Definition of source state.
 */
export interface ISourceManagerState {
    /**
     * The channel configuration for the source.
     */
    channel?: IMamChannelConfiguration;
    /**
     * The last output time slot.
     */
    lastOutputTime?: number;
}
