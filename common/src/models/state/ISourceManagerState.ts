import { IMamChannelConfiguration } from "../mam/IMamChannelConfiguration";

/**
 * Definition of source state.
 */
export interface ISourceManagerState<S> {
    /**
     * The channel configuration for the source.
     */
    channel?: IMamChannelConfiguration;

    /**
     * The state for the strategy.
     */
    strategyState?: S;
}
