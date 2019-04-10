import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IProducerConfiguration } from "../models/config/producer/IProducerConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IRegistration } from "../models/services/registration/IRegistration";
/**
 * Class to maintain a Producer.
 */
export declare class ProducerService {
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
     * Intialise the producer by registering with the Grid.
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
     * Combine the information from the sources and generate an output command.
     * @param calculatePrice Calculate the price for an output.
     */
    collateSources(calculatePrice: (startTime: number, endTime: number, value: number) => number): Promise<void>;
    /**
     * Should we create a return channel when adding a registration.
     * @param registration The registration to check.
     */
    shouldCreateReturnChannel(registration: IRegistration): boolean;
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    handleCommands(registration: IRegistration, commands: IMamCommand[]): Promise<void>;
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
