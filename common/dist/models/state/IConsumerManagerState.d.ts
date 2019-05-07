import { IMamChannelConfiguration } from "../mam/IMamChannelConfiguration";
/**
 * Definition of consumer state.
 */
export interface IConsumerManagerState<S> {
    /**
     * The channel configuration for the consumer.
     */
    channel?: IMamChannelConfiguration;
    /**
     * The return channel configuration from the grid.
     */
    returnChannel?: IMamChannelConfiguration;
    /**
     * The state for the strategy.
     */
    strategyState?: S;
}
