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
                producerTotals: {},
                consumerTotals: {},
                lastTransferCheck: 0,
                lastIncomingTransferTime: 0,
                lastOutgoingTransferTime: 0
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
                const wallet = yield this._walletService.getWallet(gridId, gridState.strategyState.lastIncomingTransferTime, gridState.strategyState.lastOutgoingTransferTime);
                if (wallet) {
                    if (wallet.incomingTransfers && wallet.incomingTransfers.length > 0) {
                        this._loggingService.log("basic-grid", `Incoming transfers after ${gridState.strategyState.lastIncomingTransferTime}`, wallet.incomingTransfers);
                        let totalIncoming = 0;
                        for (let i = 0; i < wallet.incomingTransfers.length; i++) {
                            const consumerId = wallet.incomingTransfers[i].reference;
                            if (gridState.strategyState.consumerTotals[consumerId]) {
                                gridState.strategyState.consumerTotals[consumerId].outstanding -=
                                    wallet.incomingTransfers[i].value;
                                gridState.strategyState.consumerTotals[consumerId].paid +=
                                    wallet.incomingTransfers[i].value;
                                totalIncoming += wallet.incomingTransfers[i].value;
                                if (wallet.incomingTransfers[i].created >
                                    gridState.strategyState.lastIncomingTransferTime) {
                                    gridState.strategyState.lastIncomingTransferTime =
                                        wallet.incomingTransfers[i].created;
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
exports.BasicGridStrategy = BasicGridStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVzdEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFXMUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlCLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxJQUFJLENBQUMsTUFBYzs7WUFDNUIsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsb0JBQW9CLEVBQUUsQ0FBQztnQkFDdkIsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLGNBQWMsRUFBRSxFQUFFO2dCQUNsQixpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQix3QkFBd0IsRUFBRSxDQUFDO2dCQUMzQix3QkFBd0IsRUFBRSxDQUFDO2FBQzlCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLFNBQVMsQ0FDbEIsTUFBYyxFQUNkLGlCQUEwRCxFQUMxRCxTQUFxRDs7WUFhckQsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUUzQix3REFBd0Q7WUFDeEQsS0FBSyxNQUFNLFVBQVUsSUFBSSxpQkFBaUIsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNyRCxTQUFTLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRzt3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