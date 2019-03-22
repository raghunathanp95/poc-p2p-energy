import { IMamChannelConfiguration } from "poc-p2p-energy-grid-common";

/**
 * Definition of consumer state.
 */
export interface IConsumerState {
    /**
     * The channel configuration for the consumer.
     */
    channel?: IMamChannelConfiguration;

    /**
     * The return channel configuration from the grid.
     */
    returnChannel?: IMamChannelConfiguration;
}
