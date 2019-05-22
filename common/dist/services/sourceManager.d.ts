import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { ISourceConfiguration } from "../models/config/source/ISourceConfiguration";
import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../models/state/ISourceManagerState";
import { ISourceStrategy } from "../models/strategies/ISourceStrategy";
/**
 * Class to handle a source.
 */
export declare class SourceManager<S> {
    /**
     * Configuration for the source.
     */
    private readonly _config;
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
    /**
     * Registration service.
     */
    private readonly _registrationService;
    /**
     * Logging service.
     */
    private readonly _loggingService;
    /**
     * The current state for the source.
     */
    private _state?;
    /**
     * The strategy for generating output commands.
     */
    private readonly _strategy;
    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the source.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor(sourceConfig: ISourceConfiguration, loadBalancerSettings: LoadBalancerSettings, strategy: ISourceStrategy<S>);
    /**
     * Get the state for the manager.
     */
    getState(): ISourceManagerState<S>;
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
     * Call the strategy to produce values for the source.
     * @returns Any new source output commands.
     */
    updateStrategy(): Promise<ISourceOutputCommand[]>;
    /**
     * Load the state for the producer.
     */
    private loadState;
    /**
     * Store the state for the source.
     */
    private saveState;
}
