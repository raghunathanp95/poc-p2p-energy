import { IConsumerUsageCommand } from "p2p-energy-common/dist/models/mam/IConsumerUsageCommand";
import { IConsumerManagerState } from "p2p-energy-common/dist/models/state/IConsumerManagerState";

export interface IDemoConsumerState {
    /**
     * The consumer manager state.
     */
    consumerManagerState: IConsumerManagerState;

    /**
     * The usage commands from the consumer.
     */
    usageCommands: IConsumerUsageCommand[];
}
