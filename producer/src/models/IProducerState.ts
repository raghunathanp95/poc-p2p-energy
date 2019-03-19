import { IMamChannelConfiguration } from "poc-p2p-energy-grid-common";

/**
 * Definition of producer state.
 */
export interface IProducerState {
    /**
     * The current address index to user for payments.
     */
    addressIndex: number;

    /**
     * The channel configuration for the producer.
     */
    channel?: IMamChannelConfiguration;

    /**
     * The time of the last output command.
     */
    lastOutputTime: number;
}
