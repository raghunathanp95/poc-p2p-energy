import { IMamChannelConfiguration } from "../mam/IMamChannelConfiguration";
/**
 * Definition of consumer state.
 */
export interface IConsumerManagerState {
    /**
     * The channel configuration for the consumer.
     */
    channel?: IMamChannelConfiguration;
    /**
     * The return channel configuration from the grid.
     */
    returnChannel?: IMamChannelConfiguration;
    /**
     * The last usage time slot.
     */
    lastUsageTime?: number;
    /**
     * Paid balance.
     */
    paidBalance?: number;
    /**
     * Owed balance.
     */
    owedBalance?: number;
}
