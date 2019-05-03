import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { IGridConfiguration } from "../models/config/grid/IGridConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IRegistration } from "../models/services/registration/IRegistration";
import { IGridManagerState } from "../models/state/IGridManagerState";
/**
 * Service to handle the grid.
 */
export declare class GridManager {
    /**
     * Configuration for the grid.
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
     * The current state for the producer.
     */
    private _state?;
    /**
     * Create a new instance of GridService.
     * @param gridConfig The configuration for the grid.
     * @param loadBalancerSettings Load balancer settings for communications.
     */
    constructor(gridConfig: IGridConfiguration, loadBalancerSettings: LoadBalancerSettings);
    /**
     * Get the state for the manager.
     */
    getState(): IGridManagerState;
    /**
     * Initialise the grid.
     */
    initialise(): Promise<void>;
    /**
     * Closedown the grid.
     */
    closedown(): Promise<void>;
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    handleCommands(registration: IRegistration, commands: IMamCommand[]): Promise<void>;
    /**
     * Check if payments have been confirmed for producer outputs.
     */
    checkPayments(): Promise<void>;
    /**
     * Remove the state for the grid.
     */
    removeState(): Promise<void>;
    /**
     * Load the state for the grid.
     */
    private loadState;
    /**
     * Store the state for the grid.
     */
    private saveState;
}
