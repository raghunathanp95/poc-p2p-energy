import { ServiceFactory } from "../factories/serviceFactory";
import { IConsumerPaymentRequestCommand } from "../models/mam/IConsumerPaymentRequestCommand";
import { IConsumerUsageCommand } from "../models/mam/IConsumerUsageCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { IWalletService } from "../models/services/IWalletService";
import { IConsumerManagerState } from "../models/state/IConsumerManagerState";
import { IBasicConsumerStrategyState } from "../models/strategies/IBasicConsumerStrategyState";
import { IConsumerStrategy } from "../models/strategies/IConsumerStrategy";

/**
 * Basic implementation of a consumer strategy.
 */
export class BasicConsumerStrategy implements IConsumerStrategy<IBasicConsumerStrategyState> {
    /**
     * The base for timing.
     */
    private static readonly TIME_BASIS: number = 30000;

    /**
     * How long do we consider a time before item was idle.
     */
    private static readonly TIME_IDLE: number = 5 * 30000;

    /**
     * Logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Wallet service.
     */
    private readonly _walletService: IWalletService;

    /**
     * Create a new instance of BasicConsumerStrategy.
     */
    constructor() {
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
        this._walletService = ServiceFactory.get<IWalletService>("wallet");
    }

    /**
     * Initialise the state.
     * @param consumerId The id of the consumer
     */
    public async init(consumerId: string): Promise<IBasicConsumerStrategyState> {
        return {
            initialTime: Date.now(),
            lastUsageTime: Date.now(),
            usageTotal: 0,
            paidBalance: 0,
            paymentsSent: 0,
            paymentsConfirmed: 0,
            outstandingBalance: 0
        };
    }

    /**
     * Gets the usage values.
     * @param consumerId The id of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @returns List of usage commands.
     */
    public async usage(
        consumerId: string,
        consumerState: IConsumerManagerState<IBasicConsumerStrategyState>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
            /**
             * New commands to output.
             */
            commands: IConsumerUsageCommand[];
        }> {
        // For this basic demonstration strategy we just supply a new random value
        // with a time based on a fictional time basis
        // in a real setup this would come from hardware like a meter
        const commands: IConsumerUsageCommand[] = [];
        let updatedState = false;

        const now = Date.now();
        if ((now - consumerState.strategyState.lastUsageTime) > BasicConsumerStrategy.TIME_IDLE) {
            // Looks like the consumer has not been running for some time
            // so create a catchup entry
            commands.push({
                command: "usage",
                startTime: consumerState.strategyState.lastUsageTime + 1,
                endTime: now,
                usage: 0
            });

            updatedState = true;
            consumerState.strategyState.lastUsageTime = now;
        } else {
            while ((Date.now() - consumerState.strategyState.lastUsageTime) > BasicConsumerStrategy.TIME_BASIS) {
                const endTime = consumerState.strategyState.lastUsageTime + BasicConsumerStrategy.TIME_BASIS;
                // tslint:disable-next-line:insecure-random
                const usage = Math.random();
                commands.push({
                    command: "usage",
                    startTime: consumerState.strategyState.lastUsageTime + 1,
                    endTime,
                    usage
                });

                updatedState = true;
                consumerState.strategyState.lastUsageTime = endTime;
                consumerState.strategyState.usageTotal += usage;
            }
        }

        return {
            updatedState,
            commands
        };
    }

    /**
     * Processes payment requests.
     * @param consumerId The id of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @param paymentRequests Payment requests to process.
     */
    public async paymentRequests(
        consumerId: string,
        consumerState: IConsumerManagerState<IBasicConsumerStrategyState>,
        paymentRequests: IConsumerPaymentRequestCommand[]):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
        }> {

        let updatedState = false;

        if (paymentRequests.length > 0) {
            consumerState.strategyState.outstandingBalance += paymentRequests.reduce((a, b) => a + b.owed, 0);

            // Consumer pays the grid every multiple of 10i and using the dummy wallet
            // a real world system would keep track of which payments go to each address
            const payableBalance = Math.floor(consumerState.strategyState.outstandingBalance / 10) * 10;
            if (payableBalance > 0) {
                const bundle = await this._walletService.transfer(
                    consumerId,
                    paymentRequests[paymentRequests.length - 1].paymentIdOrAddress,
                    payableBalance);

                consumerState.strategyState.paymentsSent++;
                consumerState.strategyState.outstandingBalance -= payableBalance;
                consumerState.strategyState.paidBalance += payableBalance;

                updatedState = true;

                this._loggingService.log("basic-consumer", "wallet", {
                    amount: payableBalance,
                    bundle
                });
            }
        }

        if (consumerState.strategyState.paymentsConfirmed < consumerState.strategyState.paymentsSent) {
            const lastOutgoingTransfer = consumerState.strategyState.transfers &&
                consumerState.strategyState.transfers.length > 0 ?
                consumerState.strategyState.transfers[consumerState.strategyState.transfers.length - 1].created : 0;

            const wallet = await this._walletService.getWallet(consumerId, undefined, lastOutgoingTransfer);

            if (wallet && wallet.outgoingTransfers) {
                consumerState.strategyState.transfers = consumerState.strategyState.transfers || [];
                consumerState.strategyState.transfers =
                    consumerState.strategyState.transfers.concat(wallet.outgoingTransfers);
                consumerState.strategyState.transfers = consumerState.strategyState.transfers.slice(-10);
                consumerState.strategyState.paymentsConfirmed += wallet.outgoingTransfers.length;
                updatedState = true;
            }
        }

        return {
            updatedState
        };
    }
}
