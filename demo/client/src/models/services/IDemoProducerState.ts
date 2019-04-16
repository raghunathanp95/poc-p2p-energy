import { IProducerOutputCommand } from "p2p-energy-common/dist/models/mam/IProducerOutputCommand";
import { IProducerManagerState } from "p2p-energy-common/dist/models/state/IProducerManagerState";

export interface IDemoProducerState {
    /**
     * The producer manager state.
     */
    producerManagerState?: IProducerManagerState;

    /**
     * The output commands from the producer.
     */
    outputCommands: IProducerOutputCommand[];
}
