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
     * Initialise the state.
     * @param gridId The id of the grid.
     */
    init(gridId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentService = serviceFactory_1.ServiceFactory.get("payment");
            yield paymentService.register(gridId);
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
                    const paymentService = serviceFactory_1.ServiceFactory.get("payment");
                    paymentAddress = yield paymentService.getAddress(gridId, addressIndex);
                }
                const paymentRequest = this.updateConsumerUsage(gridId, paymentAddress, gridState.strategyState.consumerTotals[consumerId], newUsage);
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
     * @param paymentAddress The payment address for the grid.
     * @param consumerTotals The total for the consumer.
     * @param newUsage Additional usage for the consumer.
     * @returns A new payment request command or nothing.
     */
    updateConsumerUsage(gridId, paymentAddress, consumerTotals, newUsage) {
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
exports.BasicGridStrategy = BasicGridStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVTdEOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFDMUI7OztPQUdHO0lBQ1UsSUFBSSxDQUFDLE1BQWM7O1lBQzVCLE1BQU0sY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztZQUV0RSxNQUFNLGNBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEMsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsb0JBQW9CLEVBQUUsQ0FBQztnQkFDdkIsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLGNBQWMsRUFBRSxFQUFFO2FBQ3JCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLFNBQVMsQ0FDbEIsTUFBYyxFQUNkLGlCQUEwRCxFQUMxRCxTQUFxRDs7WUFhckQsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztZQUN4QixNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7WUFFM0Isd0RBQXdEO1lBQ3hELEtBQUssTUFBTSxVQUFVLElBQUksaUJBQWlCLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDckQsU0FBUyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUc7d0JBQ2pELEtBQUssRUFBRSxDQUFDO3dCQUNSLGNBQWMsRUFBRSxDQUFDO3dCQUNqQixXQUFXLEVBQUUsQ0FBQzt3QkFDZCxJQUFJLEVBQUUsQ0FBQzt3QkFD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