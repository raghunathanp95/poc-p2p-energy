import { IMamChannelConfiguration } from "../mam/IMamChannelConfiguration";
/**
 * Definition of producer state.
 */
export interface IProducerManagerState {
    /**
     * The seed used to generate payment addressses.
     */
    paymentSeed: string;
    /**
     * The time the producer was created.
     */
    producerCreated: number;
    /**
     * The channel configuration for the producer.
     */
    channel?: IMamChannelConfiguration;
    /**
     * Received balance.
     */
    receivedBalance?: number;
    /**
     * Owed balance.
     */
    owedBalance?: number;
    /**
     * The time of the last output command.
     */
    lastOutputTime?: number;
}
