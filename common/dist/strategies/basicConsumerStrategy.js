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
 * Basic implementation of a consumer strategy.
 */
class BasicConsumerStrategy {
    /**
     * Create a new instance of BasicConsumerStrategy.
     */
    constructor() {
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
    }
    /**
     * Initialise the state.
     * @param consumerId The id of the consumer
     */
    init(consumerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentService = serviceFactory_1.ServiceFactory.get("payment");
            yield paymentService.register(consumerId);
            return {
                initialTime: Date.now(),
                lastUsageTime: Date.now(),
                usageTotal: 0,
                paidBalance: 0,
                outstandingBalance: 0
            };
        });
    }
    /**
     * Gets the usage values.
     * @param consumerId The id of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @returns List of usage commands.
     */
    usage(consumerId, consumerState) {
        return __awaiter(this, void 0, void 0, function* () {
            // For this basic demonstration strategy we just supply a new random value
            // with a time based on a fictional time basis
            // in a real setup this would come from hardware like a meter
            const commands = [];
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
            }
            else {
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
        });
    }
    /**
     * Processes payment requests.
     * @param consumerId The id of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @param paymentRequests Payment requests to process.
     */
    paymentRequests(consumerId, consumerState, paymentRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            if (paymentRequests.length > 0) {
                consumerState.strategyState.outstandingBalance += paymentRequests.reduce((a, b) => a + b.owed, 0);
                // Consumer pays the grid every multiple of 10i and using the most recent payment address
                // a real world system would keep track of which payments go to each address
                const payableBalance = Math.floor(consumerState.strategyState.outstandingBalance / 10) * 10;
                if (payableBalance > 0) {
                    const paymentService = serviceFactory_1.ServiceFactory.get("payment");
                    const bundle = yield paymentService.transfer(consumerId, paymentRequests[paymentRequests.length - 1].paymentRegistrationId, paymentRequests[paymentRequests.length - 1].paymentAddress, payableBalance);
                    consumerState.strategyState.outstandingBalance -= payableBalance;
                    consumerState.strategyState.paidBalance += payableBalance;
                    consumerState.strategyState.lastPaymentBundle = bundle;
                    this._loggingService.log("basic-consumer", "payment", {
                        address: paymentRequests[paymentRequests.length - 1].paymentAddress,
                        amount: payableBalance,
                        bundle
                    });
                }
            }
            return {
                updatedState: paymentRequests.length > 0
            };
        });
    }
}
/**
 * The base for timing.
 */
BasicConsumerStrategy.TIME_BASIS = 30000;
/**
 * How long do we consider a time before item was idle.
 */
BasicConsumerStrategy.TIME_IDLE = 5 * 30000;
exports.BasicConsumerStrategy = BasicConsumerStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNDb25zdW1lclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNDb25zdW1lclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFTN0Q7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQWdCOUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxJQUFJLENBQUMsVUFBa0I7O1lBQ2hDLE1BQU0sY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztZQUV0RSxNQUFNLGNBQWMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFMUMsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsYUFBYSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFdBQVcsRUFBRSxDQUFDO2dCQUNkLGtCQUFrQixFQUFFLENBQUM7YUFDeEIsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsS0FBSyxDQUNkLFVBQWtCLEVBQ2xCLGFBQWlFOztZQVdqRSwwRUFBMEU7WUFDMUUsOENBQThDO1lBQzlDLDZEQUE2RDtZQUM3RCxNQUFNLFFBQVEsR0FBNEIsRUFBRSxDQUFDO1lBQzdDLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztZQUV6QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxHQUFHLHFCQUFxQixDQUFDLFNBQVMsRUFBRTtnQkFDckYsNkRBQTZEO2dCQUM3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