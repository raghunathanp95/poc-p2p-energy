import { IMamChannelConfiguration } from "../mam/IMamChannelConfiguration";

/**
 * Definition of producer state.
 */
export interface IProducerState {
    /**
     * The seed used to generate payment addressses.
     */
    paymentSeed: string;

    /**
     * The current address index to user for payments.
     */
    paymentAddressIndex: number;

    /**
     * The channel configuration for the producer.
     */
    channel?: IMamChannelConfiguration;

    /**
     * The time of the last output command.
     */
    lastOutputTime: number;
}
