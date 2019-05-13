import { IMamChannelConfiguration } from "../mam/IMamChannelConfiguration";

/**
 * Definition of producer state.
 */
export interface IProducerManagerState<S> {
    /**
     * The channel configuration for the producer.
     */
    channel?: IMamChannelConfiguration;

    /**
     * The state for the strategy.
     */
    strategyState?: S;
}
