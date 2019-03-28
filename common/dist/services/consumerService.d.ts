import { IConsumerConfiguration } from "../models/config/consumer/IConsumerConfiguration";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
/**
 * Class to handle a consumer.
 */
export declare class ConsumerService {
    /**
     * Configuration for the consumer.
     */
    private readonly _config;
    /**
     * Configuration for the grid api.
     */
    private readonly _gridApiEndpoint;
    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfig;
    /**
     * Logging service.
     */
    private readonly _loggingService;
    /**
     * The current state for the consumer.
     */
    private _state?;
    /**
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param gridApiEndpoint The grid api endpoint.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(consumerConfig: IConsumerConfiguration, gridApiEndpoint: string, nodeConfig: INodeConfiguration);
    /**
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    intialise(): Promise<void>;
    /**
     * Unregister the source from the Grid.
     */
    closedown(): Promise<void>;
    /**
     * Load the state for the consumer.
     */
    private loadState;
    /**
     * Store the state for the consumer.
     */
    private saveState;
}
