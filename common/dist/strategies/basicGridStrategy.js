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
const core_1 = require("@iota/core");
/**
 * Basic implementation of a grid strategy.
 */
class BasicGridStrategy {
    /**
     * Initialise the state.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                initialTime: Date.now(),
                runningCostsTotal: 0,
                runningCostsReceived: 0,
                producerTotals: {},
                consumerTotals: {}
            };
        });
    }
    /**
     * Collated consumers usage.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    consumers(consumerUsageById, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    const addressIndex = Math.floor((Date.now() - gridState.strategyState.initialTime) / 3600000);
                    paymentAddress = core_1.generateAddress(gridState.paymentSeed, addressIndex, 2);
                }
                const paymentRequest = this.updateConsumerUsage(paymentAddress, gridState.strategyState.consumerTotals[consumerId], newUsage);
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
        });
    }
    /**
     * Collated producer output.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    producers(producerUsageById, gridState) {
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
     * Update the usage for the consumer.
     * @param paymentAddress The payment address for the grid.
     * @param consumerTotals The total for the consumer.
     * @param newUsage Additional usage for the consumer.
     * @returns A new payment request command or nothing.
     */
    updateConsumerUsage(paymentAddress, consumerTotals, newUsage) {
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
                paymentAddress
            };
        }
        return undefined;
    }
}
exports.BasicGridStrategy = BasicGridStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUNBQTZDO0FBUzdDOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFDMUI7O09BRUc7SUFDVSxJQUFJOztZQUNiLE9BQU87Z0JBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZCLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLG9CQUFvQixFQUFFLENBQUM7Z0JBQ3ZCLGNBQWMsRUFBRSxFQUFFO2dCQUNsQixjQUFjLEVBQUUsRUFBRTthQUNyQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLFNBQVMsQ0FDbEIsaUJBQTBELEVBQzFELFNBQXFEOztZQWFyRCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDekIsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUUzQix3REFBd0Q7WUFDeEQsS0FBSyxNQUFNLFVBQVUsSUFBSSxpQkFBaUIsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNyRCxTQUFTLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRzt3QkFDakQsS0FBSyxFQUFFLENBQUM7d0JBQ1IsY0FBYyxFQUFFLENBQUM7d0JBQ2pCLFdBQVcsRUFBRSxDQUFDO3dCQUNkLElBQUksRUFBRSxDQUFDO3dCQUNQLFNBQVMsRUFBRSxDQUFDO3FCQUNmLENBQUM7aUJBQ0w7Z0JBRUQsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FB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