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
        this._walletService = serviceFactory_1.ServiceFactory.get("wallet");
    }
    /**
     * Initialise the state.
     * @param consumerId The id of the consumer
     * @returns The state of the consumer.
     */
    init(consumerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                lastUsageTime: Date.now(),
                usageTotal: 0,
                paidBalance: 0,
                paymentsSent: 0,
                paymentsConfirmed: 0,
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
                // so reset the timer
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
     * @returns If the state was updated.
     */
    paymentRequests(consumerId, consumerState, paymentRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedState = false;
            if (paymentRequests.length > 0) {
                consumerState.strategyState.outstandingBalance += paymentRequests.reduce((a, b) => a + b.owed, 0);
                // Consumer pays the grid every multiple of 25i and using the dummy wallet
                // a real world system would keep track of which payments go to each address
                const payableBalance = Math.floor(consumerState.strategyState.outstandingBalance / 25) * 25;
                if (payableBalance > 0) {
                    yield this._walletService.transfer(consumerId, paymentRequests[paymentRequests.length - 1].paymentIdOrAddress, payableBalance);
                    consumerState.strategyState.paymentsSent++;
                    consumerState.strategyState.outstandingBalance -= payableBalance;
                    consumerState.strategyState.paidBalance += payableBalance;
                    updatedState = true;
                    this._loggingService.log("basic-consumer", "wallet", {
                        amount: payableBalance
                    });
                }
            }
            if (consumerState.strategyState.paymentsConfirmed < consumerState.strategyState.paymentsSent) {
                const lastOutgoingEpoch = consumerState.strategyState.lastOutgoingTransfer ?
                    consumerState.strategyState.lastOutgoingTransfer.created : 0;
                const wallet = yield this._walletService.getWallet(consumerId, undefined, lastOutgoingEpoch);
                if (wallet && wallet.outgoingTransfers && wallet.outgoingTransfers.length > 0) {
                    consumerState.strategyState.lastOutgoingTransfer =
                        wallet.outgoingTransfers[wallet.outgoingTransfers.length - 1];
                    consumerState.strategyState.paymentsConfirmed += wallet.outgoingTransfers.length;
                    updatedState = true;
                }
            }
            return {
                updatedState
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNDb25zdW1lclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNDb25zdW1lclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFTN0Q7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQXFCOUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlCLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsSUFBSSxDQUFDLFVBQWtCOztZQUNoQyxPQUFPO2dCQUNILGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUN6QixVQUFVLEVBQUUsQ0FBQztnQkFDYixXQUFXLEVBQUUsQ0FBQztnQkFDZCxZQUFZLEVBQUUsQ0FBQztnQkFDZixpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixrQkFBa0IsRUFBRSxDQUFDO2FBQ3hCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLEtBQUssQ0FDZCxVQUFrQixFQUNsQixhQUFpRTs7WUFXakUsMEVBQTBFO1lBQzFFLDhDQUE4QztZQUM5Qyw2REFBNkQ7WUFDN0QsTUFBTSxRQUFRLEdBQTRCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JGLDZEQUE2RDtnQkFDN0QscUJBQXFCO2dCQUNyQixZQUFZLEdBQUcsSUFBSSxD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