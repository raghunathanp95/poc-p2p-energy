"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
     * @param gridId The id of the grid.
     */
    init(gridId) {
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
     * @param gridId The id of the grid.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    consumers(gridId, consumerUsageById, gridState) {
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
                const paymentRequest = this.updateConsumerUsage(gridId, gridState.strategyState.consumerTotals[consumerId], newUsage);
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
     * @param gridId The id of the grid.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    producers(gridId, producerUsageById, gridState) {
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
     * @param gridId The id of the grid.
     * @param gridState The current state of the grid.
     */
    payments(gridId, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedState = false;
            const now = Date.now();
            if (now - gridState.strategyState.lastTransferCheck > 10000) {
                // Get all the payment since the last epochs
                let incomingEpoch = gridState.strategyState.lastIncomingTransfer ?
                    gridState.strategyState.lastIncomingTransfer.created : 0;
                const outgoingEpoch = gridState.strategyState.lastOutgoingTransfer ?
                    gridState.strategyState.lastOutgoingTransfer.created : 0;
                const wallet = yield this._walletService.getWallet(gridId, incomingEpoch, outgoingEpoch);
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
                yield this.payProducers(gridId, gridState);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVzdEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFXMUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlCLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxJQUFJLENBQUMsTUFBYzs7WUFDNUIsT0FBTztnQkFDSCxpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixvQkFBb0IsRUFBRSxDQUFDO2dCQUN2QixxQkFBcUIsRUFBRSxDQUFDO2dCQUN4QixjQUFjLEVBQUUsRUFBRTtnQkFDbEIsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLG9CQUFvQixFQUFFLFNBQVM7Z0JBQy9CLG9CQUFvQixFQUFFLFNBQVM7YUFDbEMsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsU0FBUyxDQUNsQixNQUFjLEVBQ2QsaUJBQTBELEVBQzFELFNBQXFEOztZQWFyRCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDekIsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO1lBRTNCLHdEQUF3RDtZQUN4RCxLQUFLLE1BQU0sVUFBVSxJQUFJLGlCQUFpQixFQUFFO2dCQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3JELFNBQVMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHO3dCQUNqRCxLQUFLLEVB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