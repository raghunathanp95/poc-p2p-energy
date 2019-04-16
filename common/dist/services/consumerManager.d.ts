import { IConsumerConfiguration } from "../models/config/consumer/IConsumerConfiguration";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IConsumerUsageCommand } from "../models/mam/IConsumerUsageCommand";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IConsumerManagerState } from "../models/state/IConsumerManagerState";
/**
 * Class to handle a consumer.
 */
export declare class ConsumerManager {
    /**
     * Configuration for the consumer.
     */
    private readonly _config;
    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfig;
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
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(consumerConfig: IConsumerConfiguration, nodeConfig: INodeConfiguration);
    /**
     * Get the state for the manager.
     */
    getState(): IConsumerManagerState;
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
     * Send a usage command to the mam channel.
     * @param endTime The end time for the current period.
     * @param value The usage to send.
     */
    sendUsageCommand(endTime: number, value: number): Promise<IConsumerUsageCommand>;
    /**
     * Send a command to the channel.
     */
    sendCommand<T extends IMamCommand>(command: T): Promise<T>;
    /**
     * Remove the state for the consumer.
     */
    removeState(): Promise<void>;
    /**
     * Load the state for the consumer.
     */
    private loadState;
    /**
     * Store the state for the consumer.
     */
    private saveState;
}
