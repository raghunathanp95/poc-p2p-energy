"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const serviceFactory_1 = require("../factories/serviceFactory");
/**
 * Basic implementation of a grid strategy.
 */
class BasicGridStrategy {
    /**
     * Create a new instance of BasicGridStrategy.
     */
    constructor() {
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._walletService = serviceFactory_1.ServiceFactory.get("wallet");
    }
    /**
     * Initialise the state.
     * @returns The state of the grid.
     */
    initState() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                runningCostsTotal: 0,
                runningCostsReceived: 0,
                distributionAvailable: 0,
                producerTotals: {},
                consumerTotals: {},
                lastTransferCheck: 0,
                lastIncomingTransfer: undefined,
                lastOutgoingTransfer: undefined
            };
        });
    }
    /**
     * Collated consumers usage.
     * @param config The id of the grid.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     * @returns If the state has been updated and any payment requests to send.
     */
    consumers(config, consumerUsageById, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const paymentRequest = this.updateConsumerUsage(config.id, gridState.strategyState.consumerTotals[consumerId], newUsage);
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
        });
    }
    /**
     * Collated producer output.
     * @param config The config of the grid.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     * @returns If the state was updated.
     */
    producers(config, producerUsageById, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedState = false;
            if (Object.keys(producerUsageById).length > 0) {
                // Update the producers output based on any commands
                for (const producerId in producerUsageById) {
                    if (!gridState.strategyState.producerTotals[producerId]) {
                        gridState.strategyState.producerTotals[producerId] = {
                            output: 0,
                            owed: 0,
                            received: 0,
                            percentage: 0
                        };
                    }
                    updatedState = true;
                    gridState.strategyState.producerTotals[producerId].output +=
                        producerUsageById[producerId].reduce((a, b) => a + b.output, 0);
                    // Just remove the usage data, in a real system we might want to archive this
                    producerUsageById[producerId] = [];
                }
                // Now go through all the producers and calculate their percentage contribution to the
                // total grid output, we will then later use that to decide how much of the consumer payments
                // they will receive
                let totalOutput = 0;
                for (const producerId in gridState.strategyState.producerTotals) {
                    totalOutput += gridState.strategyState.producerTotals[producerId].output;
                }
                for (const producerId in gridState.strategyState.producerTotals) {
                    gridState.strategyState.producerTotals[producerId].percentage =
                        gridState.strategyState.producerTotals[producerId].output / totalOutput;
                }
            }
            return {
                updatedState
            };
        });
    }
    /**
     * Collated payments.
     * @param config The config of the grid.
     * @param gridState The current state of the grid.
     * @returns If the state was updated.
     */
    payments(config, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedState = false;
            const now = Date.now();
            if (now - gridState.strategyState.lastTransferCheck > 10000) {
                // Get all the payment since the last epochs
                let incomingEpoch = gridState.strategyState.lastIncomingTransfer ?
                    gridState.strategyState.lastIncomingTransfer.created : 0;
                const outgoingEpoch = gridState.strategyState.lastOutgoingTransfer ?
                    gridState.strategyState.lastOutgoingTransfer.created : 0;
                const wallet = yield this._walletService.getWallet(config.id, incomingEpoch, outgoingEpoch);
                if (wallet) {
                    if (wallet.incomingTransfers && wallet.incomingTransfers.length > 0) {
                        this._loggingService.log("basic-grid", `Incoming transfers after ${incomingEpoch}`, wallet.incomingTransfers);
                        let totalIncoming = 0;
                        for (let i = 0; i < wallet.incomingTransfers.length; i++) {
                            const consumerId = wallet.incomingTransfers[i].reference;
                            if (gridState.strategyState.consumerTotals[consumerId]) {
                                gridState.strategyState.consumerTotals[consumerId].outstanding -=
                                    wallet.incomingTransfers[i].value;
                                gridState.strategyState.consumerTotals[consumerId].paid +=
                                    wallet.incomingTransfers[i].value;
                                totalIncoming += wallet.incomingTransfers[i].value;
                                if (wallet.incomingTransfers[i].created > incomingEpoch) {
                                    incomingEpoch = wallet.incomingTransfers[i].created;
                                    gridState.strategyState.lastIncomingTransfer = wallet.incomingTransfers[i];
                                }
                            }
                        }
                        // We are taking 1i out of every 5i as running costs
                        const runningCostsUsed = totalIncoming / 5;
                        gridState.strategyState.runningCostsReceived += runningCostsUsed;
                        // Add remainder to the total for distribution to producers
                        gridState.strategyState.distributionAvailable += totalIncoming - runningCostsUsed;
                    }
                    if (wallet.outgoingTransfers && wallet.outgoingTransfers.length > 0) {
                        this._loggingService.log("basic-grid", `Outgoing transfers after ${outgoingEpoch}`, wallet.outgoingTransfers);
                        for (let i = 0; i < wallet.outgoingTransfers.length; i++) {
                            const producerId = wallet.outgoingTransfers[i].reference;
                            if (gridState.strategyState.producerTotals[producerId]) {
                                gridState.strategyState.producerTotals[producerId].owed -=
                                    wallet.outgoingTransfers[i].value;
                                gridState.strategyState.producerTotals[producerId].received +=
                                    wallet.outgoingTransfers[i].value;
                                if (wallet.outgoingTransfers[i].created > outgoingEpoch) {
                                    incomingEpoch = wallet.outgoingTransfers[i].created;
                                    gridState.strategyState.lastOutgoingTransfer = wallet.outgoingTransfers[i];
                                }
                            }
                        }
                    }
                }
                yield this.payProducers(config.id, gridState);
                updatedState = true;
                gridState.strategyState.lastTransferCheck = now;
            }
            return {
                updatedState
            };
        });
    }
    /**
     * Pay the producers using their percentage contribution
     * @param gridId The id of the grid.
     * @param gridState The current state of the grid.
     */
    payProducers(gridId, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pay out to producers on 40i boundaries
            const dist = Math.floor(gridState.strategyState.distributionAvailable / 40) * 40;
            if (dist > 0) {
                let totalDistUsed = 0;
                for (const producerId in gridState.strategyState.producerTotals) {
                    // Now based on each producers contribution to the grid give them some money
                    const payableBalance = Math.floor(dist * gridState.strategyState.producerTotals[producerId].percentage);
                    totalDistUsed += payableBalance;
                    gridState.strategyState.producerTotals[producerId].owed += payableBalance;
                    yield this._walletService.transfer(gridId, producerId, payableBalance);
                    this._loggingService.log("basic-grid", "wallet", {
                        to: producerId,
                        amount: payableBalance
                    });
                }
                gridState.strategyState.distributionAvailable -= totalDistUsed;
            }
        });
    }
    /**
     * Update the usage for the consumer.
     * @param gridId The id of the grid.
     * @param consumerTotals The total for the consumer.
     * @param newUsage Additional usage for the consumer.
     * @returns A new payment request command or nothing.
     */
    updateConsumerUsage(gridId, consumerTotals, newUsage) {
        consumerTotals.usage += newUsage;
        // Add new request for every whole kWh the consumer uses
        const unrequestedUsage = Math.floor(consumerTotals.usage - consumerTotals.requestedUsage);
        if (unrequestedUsage > 0) {
            consumerTotals.requestedUsage += unrequestedUsage;
            // For this example the producers are charging 4i for every kWh
            // As a grid we then add an additional 1i for our running costs
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
exports.BasicGridStrategy = BasicGridStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGdFQUE2RDtBQVk3RDs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBVzFCOztPQUVHO0lBQ0g7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFpQixRQUFRLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsU0FBUzs7WUFDbEIsT0FBTztnQkFDSCxpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixvQkFBb0IsRUFBRSxDQUFDO2dCQUN2QixxQkFBcUIsRUFBRSxDQUFDO2dCQUN4QixjQUFjLEVBQUUsRUFBRTtnQkFDbEIsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLG9CQUFvQixFQUFFLFNBQVM7Z0JBQy9CLG9CQUFvQixFQUFFLFNBQVM7YUFDbEMsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNVLFNBQVMsQ0FDbEIsTUFBMEIsRUFDMUIsaUJBQTBELEVBQzFELFNBQXFEOztZQWFyRCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDekIsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO1lBRTNCLHdEQUF3RDtZQUN4RCxLQUFLLE1BQU0sVUFBVSxJQUFJLGlCQUFpQixFQUFFO2dCQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3JELFNBQVMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHO3dCQUNqRCxLQUFLLEVBQUUsQ0FB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