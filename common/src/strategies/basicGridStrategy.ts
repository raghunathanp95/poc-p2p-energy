import { ServiceFactory } from "../factories/serviceFactory";
import { IConsumerUsageEntry } from "../models/db/grid/IConsumerUsageEntry";
import { IProducerOutputEntry } from "../models/db/grid/IProducerOutputEntry";
import { IConsumerPaymentRequestCommand } from "../models/mam/IConsumerPaymentRequestCommand";
import { IPaymentService } from "../models/services/IPaymentService";
import { IGridManagerState } from "../models/state/IGridManagerState";
import { IBasicGridStrategyConsumerTotals } from "../models/strategies/IBasicGridStrategyConsumerTotals";
import { IBasicGridStrategyState } from "../models/strategies/IBasicGridStrategyState";
import { IGridStrategy } from "../models/strategies/IGridStrategy";

/**
 * Basic implementation of a grid strategy.
 */
export class BasicGridStrategy implements IGridStrategy<IBasicGridStrategyState> {
    /**
     * Initialise the state.
     * @param gridId The id of the grid.
     */
    public async init(gridId: string): Promise<IBasicGridStrategyState> {
        const paymentService = ServiceFactory.get<IPaymentService>("payment");

        await paymentService.register(gridId);

        return {
            initialTime: Date.now(),
            runningCostsTotal: 0,
            runningCostsReceived: 0,
            producerTotals: {},
            consumerTotals: {}
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
        let paymentAddress = "";
        const paymentRequests = {};

        // Consume any new usage data and store it in the totals
        for (const consumerId in consumerUsageById) {
            if (!gridState.strategyState.consumerTotals[consumerId]) {
                gridState.strategyState.consumerTotals[consumerId] = {
                    usage: 0,
                    requestedUsage: 0,
                    outstanding: 0,
                    paid: 0,
                    requested: 0
                };
            }

            updatedState = true;
            const newUsage = consumerUsageById[consumerId].reduce((a, b) => a + b.usage, 0);

            if (newUsage > 0 && paymentAddress.length === 0) {
                // Calculate a payment address index to use based on the time, you could just always increment
                // but for this example we will use a new payment address every hour
                const addressIndex = Math.floor(
                    (Date.now() - gridState.strategyState.initialTime) / 3600000
                );

                const paymentService = ServiceFactory.get<IPaymentService>("payment");
                paymentAddress = await paymentService.getAddress(gridId, addressIndex);
            }

            const paymentRequest = this.updateConsumerUsage(
                gridId,
                paymentAddress,
                gridState.strategyState.consumerTotals[consumerId],
                newUsage);

            if (paymentRequest) {
                paymentRequests[consumerId] = paymentRequest;
                gridState.strategyState.consumerTotals[consumerId].outstanding += paymentRequest.owed;
                gridState.strategyState.runningCostsTotal += paymentRequest.owed / 5;
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
     * Update the usage for the consumer.
     * @param gridId The id of the grid.
     * @param paymentAddress The payment address for the grid.
     * @param consumerTotals The total for the consumer.
     * @param newUsage Additional usage for the consumer.
     * @returns A new payment request command or nothing.
     */
    private updateConsumerUsage(
        gridId: string,
        paymentAddress: string,
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
            return {
                command: "payment-request",
                owed: unrequestedUsage * 5,
                usage: unrequestedUsage,
                paymentRegistrationId: gridId,
                paymentAddress
            };
        }

        return undefined;
    }
}
