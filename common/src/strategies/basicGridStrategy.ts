import { ServiceFactory } from "../factories/serviceFactory";
import { IConsumerUsageEntry } from "../models/db/grid/IConsumerUsageEntry";
import { IProducerOutputEntry } from "../models/db/grid/IProducerOutputEntry";
import { IConsumerPaymentRequestCommand } from "../models/mam/IConsumerPaymentRequestCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { IWalletService } from "../models/services/IWalletService";
import { IGridManagerState } from "../models/state/IGridManagerState";
import { IBasicGridStrategyConsumerTotals } from "../models/strategies/IBasicGridStrategyConsumerTotals";
import { IBasicGridStrategyState } from "../models/strategies/IBasicGridStrategyState";
import { IGridStrategy } from "../models/strategies/IGridStrategy";

/**
 * Basic implementation of a grid strategy.
 */
export class BasicGridStrategy implements IGridStrategy<IBasicGridStrategyState> {
    /**
     * Logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Wallet service.
     */
    private readonly _walletService: IWalletService;

    /**
     * Create a new instance of BasicGridStrategy.
     */
    constructor() {
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
        this._walletService = ServiceFactory.get<IWalletService>("wallet");
    }

    /**
     * Initialise the state.
     * @param gridId The id of the grid.
     */
    public async init(gridId: string): Promise<IBasicGridStrategyState> {
        return {
            initialTime: Date.now(),
            runningCostsTotal: 0,
            runningCostsReceived: 0,
            producerTotals: {},
            consumerTotals: {},
            lastTransferCheck: 0,
            lastIncomingTransferTime: 0,
            lastOutgoingTransferTime: 0
        };
    }

    /**
     * Collated consumers usage.
     * @param gridId The id of the grid.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    public async consumers(
        gridId: string,
        consumerUsageById: { [id: string]: IConsumerUsageEntry[] },
        gridState: IGridManagerState<IBasicGridStrategyState>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;

            /**
             * Commands to send for each consumer.
             */
            paymentRequests: { [id: string]: IConsumerPaymentRequestCommand };
        }> {

        let updatedState = false;
        const paymentRequests = {};

        // Consume any new usage data and store it in the totals
        for (const consumerId in consumerUsageById) {
            if (!gridState.strategyState.consumerTotals[consumerId]) {
                gridState.strategyState.consumerTotals[consumerId] = {
                    usage: 0,
                    requestedUsage: 0,
                    outstanding: 0,
                    paid: 0
                };
            }

            updatedState = true;
            const newUsage = consumerUsageById[consumerId].reduce((a, b) => a + b.usage, 0);

            const paymentRequest = this.updateConsumerUsage(
                gridId,
                gridState.strategyState.consumerTotals[consumerId],
                newUsage);

            if (paymentRequest) {
                paymentRequests[consumerId] = paymentRequest;
                gridState.strategyState.consumerTotals[consumerId].outstanding += paymentRequest.owed;
                gridState.strategyState.runningCostsTotal += paymentRequest.owed / 5;

                this._loggingService.log("basic-grid", `Request payment ${paymentRequest.owed} from ${consumerId}`);
            }

            consumerUsageById[consumerId] = [];
        }

        return {
            updatedState,
            paymentRequests
        };
    }

    /**
     * Collated producer output.
     * @param gridId The id of the grid.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    public async producers(
        gridId: string,
        producerUsageById: { [id: string]: IProducerOutputEntry[] },
        gridState: IGridManagerState<IBasicGridStrategyState>): Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
        }> {

        let updatedState = false;

        for (const producerId in producerUsageById) {
            if (!gridState.strategyState.producerTotals[producerId]) {
                gridState.strategyState.producerTotals[producerId] = {
                    output: 0,
                    owed: 0,
                    received: 0
                };
            }

            updatedState = true;
            gridState.strategyState.producerTotals[producerId].output +=
                producerUsageById[producerId].reduce((a, b) => a + b.output, 0);

            producerUsageById[producerId] = [];
        }

        return {
            updatedState
        };
    }

    /**
     * Collated payments.
     * @param gridId The id of the grid.
     * @param gridState The current state of the grid.
     */
    public async payments(
        gridId: string,
        gridState: IGridManagerState<IBasicGridStrategyState>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
        }> {
        let updatedState = false;

        const now = Date.now();

        if (now - gridState.strategyState.lastTransferCheck > 10000) {
            // Get all the payment since the last epochs
            const wallet = await this._walletService.getWallet(
                gridId,
                gridState.strategyState.lastIncomingTransferTime,
                gridState.strategyState.lastOutgoingTransferTime);

            if (wallet) {
                if (wallet.incomingTransfers && wallet.incomingTransfers.length > 0) {
                    this._loggingService.log(
                        "basic-grid",
                        `Incoming transfers after ${gridState.strategyState.lastIncomingTransferTime}`,
                        wallet.incomingTransfers
                    );

                    let totalIncoming = 0;
                    for (let i = 0; i < wallet.incomingTransfers.length; i++) {
                        const consumerId = wallet.incomingTransfers[i].reference;
                        if (gridState.strategyState.consumerTotals[consumerId]) {
                            gridState.strategyState.consumerTotals[consumerId].outstanding -=
                                wallet.incomingTransfers[i].value;
                            gridState.strategyState.consumerTotals[consumerId].paid +=
                                wallet.incomingTransfers[i].value;

                            totalIncoming += wallet.incomingTransfers[i].value;

                            if (wallet.incomingTransfers[i].confirmed >
                                gridState.strategyState.lastIncomingTransferTime) {
                                gridState.strategyState.lastIncomingTransferTime =
                                    wallet.incomingTransfers[i].confirmed;
                            }
                        }
                    }
                    // We are taking 1i out of every 5i as running costs
                    gridState.strategyState.runningCostsReceived += totalIncoming / 5;
                }
                // if (wallet.outgoingTransfers) {
                //     for (let i = 0; i < wallet.outgoingTransfers.length; i++) {
                //         if (wallet.outgoingTransfers[i].confirmed >
                //gridState.strategyState.lastOutgoingTransferTime) {
                //             gridState.strategyState.lastOutgoingTransferTime = wallet.outgoingTransfers[i].confirmed;
                //         }
                //         updatedState = true;
                //     }
                // }
            }

            updatedState = true;
            gridState.strategyState.lastTransferCheck = now;
        }

        return {
            updatedState
        };

    }

    /**
     * Update the usage for the consumer.
     * @param gridId The id of the grid.
     * @param consumerTotals The total for the consumer.
     * @param newUsage Additional usage for the consumer.
     * @returns A new payment request command or nothing.
     */
    private updateConsumerUsage(
        gridId: string,
        consumerTotals: IBasicGridStrategyConsumerTotals,
        newUsage: number): IConsumerPaymentRequestCommand | undefined {
        consumerTotals.usage += newUsage;

        // Add new requested for every whole kWh the consumer uses
        const unrequestedUsage = Math.floor(consumerTotals.usage - consumerTotals.requestedUsage);
        if (unrequestedUsage > 0) {
            consumerTotals.requestedUsage += unrequestedUsage;

            // For this example we charge 5i for every kWh, of which
            // 1i is retained by the grid and 4i is split between the producers
            // The producers can request a specific price but we don't have to use it
            // Also the payment id could be an actual IOTA address, but in our demo
            // we are using it as a reference we use in the global demo wallet
            return {
                command: "payment-request",
                owed: unrequestedUsage * 5,
                usage: unrequestedUsage,
                paymentIdOrAddress: gridId
            };
        }

        return undefined;
    }
}
