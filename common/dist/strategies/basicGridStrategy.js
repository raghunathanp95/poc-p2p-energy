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
                initialTime: Date.now(),
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
                gridState.strategyState.distributionAvailable -= dist;
                for (const producerId in gridState.strategyState.producerTotals) {
                    // Now based on each producers contribution to the grid give them some money
                    const payableBalance = dist * gridState.strategyState.producerTotals[producerId].percentage;
                    gridState.strategyState.producerTotals[producerId].owed += payableBalance;
                    yield this._walletService.transfer(gridId, producerId, payableBalance);
                    this._loggingService.log("basic-grid", "wallet", {
                        to: producerId,
                        amount: payableBalance
                    });
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVzdEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFXMUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlCLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxJQUFJLENBQUMsTUFBYzs7WUFDNUIsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsb0JBQW9CLEVBQUUsQ0FBQztnQkFDdkIscUJBQXFCLEVBQUUsQ0FBQztnQkFDeEIsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLGNBQWMsRUFBRSxFQUFFO2dCQUNsQixpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixvQkFBb0IsRUFBRSxTQUFTO2dCQUMvQixvQkFBb0IsRUFBRSxTQUFTO2FBQ2xDLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLFNBQVMsQ0FDbEIsTUFBYyxFQUNkLGlCQUEwRCxFQUMxRCxTQUFxRDs7WUFhckQsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUUzQix3REFBd0Q7WUFDeEQsS0FBSyxNQUFNLFVBQVUsSUFBSSxpQkFBaUIsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNyRCxTQUFTLENBQUMsYUFBYSxDQUFDLGNB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