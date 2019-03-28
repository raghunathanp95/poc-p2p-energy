import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { ISourceConfiguration } from "../models/config/source/ISourceConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
/**
 * Class to handle a source.
 */
export declare class SourceService {
    /**
     * Configuration for the source.
     */
    private readonly _config;
    /**
     * Configuration for the producer api.
     */
    private readonly _producerApiEndpoint;
    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfig;
    /**
     * Logging service.
     */
    private readonly _loggingService;
    /**
     * The current state for the source.
     */
    private _state?;
    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the source.
     * @param producerApiEndpoint The producer api endpoint.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(sourceConfig: ISourceConfiguration, producerApiEndpoint: string, nodeConfig: INodeConfiguration);
    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    intialise(): Promise<void>;
    /**
     * Unregister the source from the Producer.
     */
    closedown(): Promise<void>;
    /**
     * Send an output command to the mam channel.
     * @param value The output to send.
     */
    sendOutputCommand(value: number): Promise<void>;
    /**
     * Send a command to the channel.
     */
    sendCommand<T extends IMamCommand>(command: T): Promise<void>;
    /**
     * Load the state for the producer.
     */
    private loadState;
    /**
     * Store the state for the source.
     */
    private saveState;
}
