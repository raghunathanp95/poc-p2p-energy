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
     */
    init(consumerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                initialTime: Date.now(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNDb25zdW1lclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNDb25zdW1lclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFTN0Q7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQXFCOUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlCLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxJQUFJLENBQUMsVUFBa0I7O1lBQ2hDLE9BQU87Z0JBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZCLGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUN6QixVQUFVLEVBQUUsQ0FBQztnQkFDYixXQUFXLEVBQUUsQ0FBQztnQkFDZCxZQUFZLEVBQUUsQ0FBQztnQkFDZixpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixrQkFBa0IsRUFBRSxDQUFDO2FBQ3hCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLEtBQUssQ0FDZCxVQUFrQixFQUNsQixhQUFpRTs7WUFXakUsMEVBQTBFO1lBQzFFLDhDQUE4QztZQUM5Qyw2REFBNkQ7WUFDN0QsTUFBTSxRQUFRLEdBQTRCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JGLDZEQUE2RDtn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