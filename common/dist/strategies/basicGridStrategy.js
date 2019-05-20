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
/**
 * Basic implementation of a grid strategy.
 */
class BasicGridStrategy {
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
                consumerTotals: {}
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
                        paid: 0,
                        requested: 0
                    };
                }
                updatedState = true;
                const newUsage = consumerUsageById[consumerId].reduce((a, b) => a + b.usage, 0);
                const paymentRequest = this.updateConsumerUsage(gridId, gridState.strategyState.consumerTotals[consumerId], newUsage);
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
            return {
                command: "payment-request",
                owed: unrequestedUsage * 5,
                usage: unrequestedUsage,
                paymentRegistrationId: gridId
            };
        }
        return undefined;
    }
}
exports.BasicGridStrategy = BasicGridStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBUUE7O0dBRUc7QUFDSCxNQUFhLGlCQUFpQjtJQUMxQjs7O09BR0c7SUFDVSxJQUFJLENBQUMsTUFBYzs7WUFDNUIsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsb0JBQW9CLEVBQUUsQ0FBQztnQkFDdkIsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLGNBQWMsRUFBRSxFQUFFO2FBQ3JCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLFNBQVMsQ0FDbEIsTUFBYyxFQUNkLGlCQUEwRCxFQUMxRCxTQUFxRDs7WUFhckQsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUUzQix3REFBd0Q7WUFDeEQsS0FBSyxNQUFNLFVBQVUsSUFBSSxpQkFBaUIsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNyRCxTQUFTLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRzt3QkFDakQsS0FBSyxFQUFFLENBQUM7d0JBQ1IsY0FBYyxFQUFFLENBQUM7d0JBQ2pCLFdBQVcsRUFBRSxDQUFDO3dCQUNkLElBQUksRUFBRSxDQUFDO3dCQUNQLFNBQVMsRUFBRSxDQUFDO3FCQUNmLENBQUM7aUJBQ0w7Z0JBRUQsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFF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