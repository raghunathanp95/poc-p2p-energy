import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { ISourceConfiguration } from "../models/config/source/ISourceConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../models/state/ISourceManagerState";
/**
 * Class to handle a source.
 */
export declare class SourceManager {
    /**
     * Configuration for the source.
     */
    private readonly _config;
    /**
     * Registration service.
     */
    private readonly _registrationService;
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
     * @param nodeConfig The configuration for a tangle node.
     */
    constructor(sourceConfig: ISourceConfiguration, nodeConfig: INodeConfiguration);
    /**
     * Get the state for the manager.
     */
    getState(): ISourceManagerState;
    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    initialise(): Promise<void>;
    /**
     * Unregister the source from the Producer.
     */
    closedown(): Promise<void>;
    /**
     * Send an output command to the mam channel.
     * @param endTime The end time for the current period.
     * @param value The output to send.
     */
    sendOutputCommand(endTime: number, value: number): Promise<ISourceOutputCommand>;
    /**
     * Send a command to the channel.
     */
    sendCommand<T extends IMamCommand>(command: T): Promise<T>;
    /**
     * Load the state for the producer.
     */
    private loadState;
    /**
     * Store the state for the source.
     */
    private saveState;
}
