import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IProducerConfiguration } from "../models/config/producer/IProducerConfiguration";
import { ISourceStoreOutput } from "../models/db/producer/ISourceStoreOutput";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";
import { IRegistration } from "../models/services/registration/IRegistration";
import { IProducerManagerState } from "../models/state/IProducerManagerState";
/**
 * Class to maintain a Producer.
 */
export declare class ProducerManager {
    /**
     * Configuration for the producer.
     */
    private readonly _config;
    /**
     * Configuration for the node.
     */
    private readonly _nodeConfig;
    /**
     * Service to log output to.
     */
    private readonly _loggingService;
    /**
     * Registration service.
     */
    private readonly _registrationService;
    /**
     * The current state for the producer.
     */
    private _state?;
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param nodeConfig The configuration for a tangle node.
     */
    constructor(producerConfig: IProducerConfiguration, nodeConfig: INodeConfiguration);
    /**
     * Get the state for the manager.
     */
    getState(): IProducerManagerState;
    /**
     * Initialise the producer by registering with the Grid.
     */
    initialise(): Promise<void>;
    /**
     * Reset the producer channel.
     */
    reset(): Promise<void>;
    /**
     * Closedown the producer by unregistering from the Grid.
     */
    closedown(): Promise<void>;
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    handleCommands(registration: IRegistration, commands: IMamCommand[]): Promise<void>;
    /**
     * Combine the information from the sources and generate an output command.
     * @param endTime The end time of the block we want to collate.
     * @param calculatePrice Calculate the price for an output.
     * @param archiveSourceOutput The source outputs combined are removed, you can archive them with this callback.
     * @returns Any new producer output commands.
     */
    update(endTime: number, calculatePrice: (startTime: number, endTime: number, combinedValue: number) => number, archiveSourceOutput: (sourceId: string, archiveOutputs: ISourceStoreOutput[]) => void): Promise<IProducerOutputCommand[]>;
    /**
     * Send a command to the channel.
     */
    sendCommand<T extends IMamCommand>(command: T): Promise<void>;
    /**
     * Load the state for the producer.
     */
    private loadState;
    /**
     * Store the state for the producer.
     */
    private saveState;
}
