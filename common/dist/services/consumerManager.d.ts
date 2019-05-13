import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { IConsumerConfiguration } from "../models/config/consumer/IConsumerConfiguration";
import { IConsumerUsageCommand } from "../models/mam/IConsumerUsageCommand";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IConsumerManagerState } from "../models/state/IConsumerManagerState";
import { IConsumerStrategy } from "../models/strategies/IConsumerStrategy";
import { IRegistration } from "src/models/services/registration/IRegistration";
/**
 * Class to handle a consumer.
 */
export declare class ConsumerManager<S> {
    /**
     * Configuration for the consumer.
     */
    private readonly _config;
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
    /**
     * Logging service.
     */
    private readonly _loggingService;
    /**
     * Registration service.
     */
    private readonly _registrationService;
    /**
     * The current state for the consumer.
     */
    private _state?;
    /**
     * The strategy for generating output commands.
     */
    private readonly _strategy;
    /**
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing usage commands.
     */
    constructor(consumerConfig: IConsumerConfiguration, loadBalancerSettings: LoadBalancerSettings, strategy: IConsumerStrategy<S>);
    /**
     * Get the state for the manager.
     */
    getState(): IConsumerManagerState<S>;
    /**
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    initialise(): Promise<void>;
    /**
     * Unregister the source from the Grid.
     */
    closedown(): Promise<void>;
    /**
     * Process return commands for the registration.
     * @param registration The registration.
     * @param returnCommands The commands to process.
     */
    handleReturnCommands(registration: IRegistration, returnCommands: IMamCommand[]): Promise<void>;
    /**
     * Call the strategy to produce usage values for the consumer and check payment requests
     * @returns Any new consumer usage commands.
     */
    updateStrategy(): Promise<IConsumerUsageCommand[]>;
    /**
     * Send a command to the channel.
     */
    sendCommand<T extends IMamCommand>(command: T): Promise<T>;
    /**
     * Load the state for the consumer.
     */
    private loadState;
    /**
     * Store the state for the consumer.
     */
    private saveState;
}
