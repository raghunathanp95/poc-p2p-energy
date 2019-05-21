import { IConsumerPaymentRequestCommand } from "../models/mam/IConsumerPaymentRequestCommand";
import { IConsumerUsageCommand } from "../models/mam/IConsumerUsageCommand";
import { IConsumerManagerState } from "../models/state/IConsumerManagerState";
import { IBasicConsumerStrategyState } from "../models/strategies/IBasicConsumerStrategyState";
import { IConsumerStrategy } from "../models/strategies/IConsumerStrategy";
/**
 * Basic implementation of a consumer strategy.
 */
export declare class BasicConsumerStrategy implements IConsumerStrategy<IBasicConsumerStrategyState> {
    /**
     * The base for timing.
     */
    private static readonly TIME_BASIS;
    /**
     * How long do we consider a time before item was idle.
     */
    private static readonly TIME_IDLE;
    /**
     * Logging service.
     */
    private readonly _loggingService;
    /**
     * Wallet service.
     */
    private readonly _walletService;
    /**
     * Create a new instance of BasicConsumerStrategy.
     */
    constructor();
    /**
     * Initialise the state.
     * @param consumerId The id of the consumer
     */
    init(consumerId: string): Promise<IBasicConsumerStrategyState>;
    /**
     * Gets the usage values.
     * @param consumerId The id of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @returns List of usage commands.
     */
    usage(consumerId: string, consumerState: IConsumerManagerState<IBasicConsumerStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
        /**
         * New commands to output.
         */
        commands: IConsumerUsageCommand[];
    }>;
    /**
     * Processes payment requests.
     * @param consumerId The id of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @param paymentRequests Payment requests to process.
     */
    paymentRequests(consumerId: string, consumerState: IConsumerManagerState<IBasicConsumerStrategyState>, paymentRequests: IConsumerPaymentRequestCommand[]): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
    }>;
}
