import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { IProducerConfiguration } from "../models/config/producer/IProducerConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";
import { IRegistration } from "../models/services/registration/IRegistration";
import { IProducerManagerState } from "../models/state/IProducerManagerState";
import { IProducerStrategy } from "../models/strategies/IProducerStrategy";
/**
 * Class to maintain a Producer.
 */
export declare class ProducerManager<S> {
    /**
     * Configuration for the producer.
     */
    private readonly _config;
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
    /**
     * Service to log output to.
     */
    private readonly _loggingService;
    /**
     * Registration service.
     */
    private readonly _registrationService;
    /**
     * The strategy for generating output commands.
     */
    private readonly _strategy;
    /**
     * The current state for the producer.
     */
    private _state?;
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor(producerConfig: IProducerConfiguration, loadBalancerSettings: LoadBalancerSettings, strategy: IProducerStrategy<S>);
    /**
     * Get the state for the manager.
     */
    getState(): IProducerManagerState<S>;
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
     * @returns Any new producer output commands.
     */
    updateStrategy(): Promise<IProducerOutputCommand[]>;
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
