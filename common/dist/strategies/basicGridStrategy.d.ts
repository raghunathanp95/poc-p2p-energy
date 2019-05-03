import { IGridStrategy } from "../models/strategies/IGridStrategy";
/**
 * Basic implementation of a grid strategy.
 */
export declare class BasicGridStrategy implements IGridStrategy {
    /**
     * Service to log output to.
     */
    private readonly _loggingService;
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor();
    /**
     * Process the strategy.
     */
    process(): Promise<void>;
}
