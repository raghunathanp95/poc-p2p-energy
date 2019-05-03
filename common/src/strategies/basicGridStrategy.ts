import { ServiceFactory } from "../factories/serviceFactory";
import { ILoggingService } from "../models/services/ILoggingService";
import { IGridStrategy } from "../models/strategies/IGridStrategy";

/**
 * Basic implementation of a grid strategy.
 */
export class BasicGridStrategy implements IGridStrategy {
    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor() {
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Process the strategy.
     */
    public async process(): Promise<void> {
        this._loggingService.log("basic-grid-strategy", "Process");
    }
}
