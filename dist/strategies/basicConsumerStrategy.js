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
     * @returns The state of the consumer.
     */
    initState() {
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
     * @param config The config of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @returns List of usage commands.
     */
    usage(config, consumerState) {
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
                    const extProps = config.extendedProperties || {};
                    const usage = extProps.usageType === "fixed" && extProps.usageValue !== undefined
                        ? extProps.usageValue
                        // tslint:disable-next-line:insecure-random
                        : Math.random();
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
     * @param config The config of the consumer
     * @param consumerState The state for the manager calling the strategy
     * @param paymentRequests Payment requests to process.
     * @returns If the state was updated.
     */
    paymentRequests(config, consumerState, paymentRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedState = false;
            if (paymentRequests.length > 0) {
                consumerState.strategyState.outstandingBalance += paymentRequests.reduce((a, b) => a + b.owed, 0);
                // Consumer pays the grid every multiple of 25i and using the dummy wallet
                // a real world system would keep track of which payments go to each address
                const payableBalance = Math.floor(consumerState.strategyState.outstandingBalance / 25) * 25;
                if (payableBalance > 0) {
                    yield this._walletService.transfer(config.id, paymentRequests[paymentRequests.length - 1].paymentIdOrAddress, payableBalance);
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
                const wallet = yield this._walletService.getWallet(config.id, undefined, lastOutgoingEpoch);
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
exports.BasicConsumerStrategy = BasicConsumerStrategy;
/**
 * The base for timing.
 */
BasicConsumerStrategy.TIME_BASIS = 30000;
/**
 * How long do we consider a time before item was idle.
 */
BasicConsumerStrategy.TIME_IDLE = 5 * 30000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNDb25zdW1lclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNDb25zdW1lclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVTdEOztHQUVHO0FBQ0gsTUFBYSxxQkFBcUI7SUFxQjlCOztPQUVHO0lBQ0g7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFpQixRQUFRLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsU0FBUzs7WUFDbEIsT0FBTztnQkFDSCxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDekIsVUFBVSxFQUFFLENBQUM7Z0JBQ2IsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsa0JBQWtCLEVBQUUsQ0FBQzthQUN4QixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDVSxLQUFLLENBQ2QsTUFBOEIsRUFDOUIsYUFBaUU7O1lBV2pFLDBFQUEwRTtZQUMxRSw4Q0FBOEM7WUFDOUMsNkRBQTZEO1lBQzdELE1BQU0sUUFBUSxHQUE0QixFQUFFLENBQUM7WUFDN0MsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcscUJBQXFCLENBQUMsU0FBUyxFQUFFO2dCQUNyRiw2REFBNkQ7Z0JBQzdELHFCQUFxQjtnQkFDckIsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIs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