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
 * Basic implementation of a producer strategy.
 */
class BasicProducerStrategy {
    /**
     * Create a new instance of BasicGridStrategy.
     */
    constructor() {
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._walletService = serviceFactory_1.ServiceFactory.get("wallet");
    }
    /**
     * Initialise the state.
     * @returns The producer state.
     */
    initState() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                lastOutputTime: Date.now(),
                outputTotal: 0,
                receivedBalance: 0,
                lastTransferCheck: 0
            };
        });
    }
    /**
     * Collated sources output.
     * @param config The id of the producer.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    sources(config, sourceOutputById, producerState) {
        return __awaiter(this, void 0, void 0, function* () {
            // For this basic strategy we just add the output of the sources together irrespective
            // of the time of day, for a more complicated strategy you could charge more during different
            // time of the day or based on demand etc
            // You would probably also collate the source data based on its time slices as well
            // Source outputs are discarded after being passed to this method, but you could archive
            // them if you want to
            const commands = [];
            let updatedState = false;
            const now = Date.now();
            if ((now - producerState.strategyState.lastOutputTime) > BasicProducerStrategy.TIME_IDLE) {
                // Looks like the producer has not been running for some time
                // so reset the timer
                updatedState = true;
                producerState.strategyState.lastOutputTime = now;
            }
            else {
                while ((Date.now() - producerState.strategyState.lastOutputTime) > BasicProducerStrategy.TIME_INTERVAL) {
                    // Find any source data that uses the same time block
                    const endTime = producerState.strategyState.lastOutputTime + BasicProducerStrategy.TIME_INTERVAL;
                    let endTimeIndex = Math.floor(producerState.strategyState.lastOutputTime / BasicProducerStrategy.TIME_INTERVAL);
                    // Delay the lookup by 30s (or 3 indexes ago) to allow the source data to propogate
                    endTimeIndex -= 3;
                    let producerTotal = 0;
                    for (const sourceId in sourceOutputById) {
                        const entryIdx = sourceOutputById[sourceId]
                            .findIndex(u => Math.floor(u.endTime / BasicProducerStrategy.TIME_INTERVAL) === endTimeIndex);
                        if (entryIdx >= 0) {
                            producerTotal += sourceOutputById[sourceId][entryIdx].output;
                            sourceOutputById[sourceId].splice(entryIdx, 1);
                        }
                    }
                    commands.push({
                        command: "output",
                        startTime: producerState.strategyState.lastOutputTime + 1,
                        endTime: endTime,
                        output: producerTotal,
                        // Calculate a cost for the producer output slice
                        // You could base this on your own costs, time of day, value etc
                        // This is a preferred cost and its up to the grid strategy to decide
                        // to use it or ignore it
                        // For this demonstration we fix it at 4i for 1kWh
                        price: producerTotal * 4,
                        // For this demo we are using the producer id as the payment id
                        // as all payments are handled by the central wallet which can
                        // perform transfers using the ids, this could equally
                        // be populated as an IOTA address
                        paymentIdOrAddress: config.id
                    });
                    producerState.strategyState.outputTotal += producerTotal;
                    producerState.strategyState.lastOutputTime = endTime;
                    updatedState = true;
                }
            }
            return {
                updatedState,
                commands
            };
        });
    }
    /**
     * Collated payments.
     * @param config The config of the producer.
     * @param producerState The current state of the producer.
     * @returns If the state was updated.
     */
    payments(config, producerState) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedState = false;
            const now = Date.now();
            if (now - producerState.strategyState.lastTransferCheck > 10000) {
                let incomingEpoch = producerState.strategyState.lastIncomingTransfer ?
                    producerState.strategyState.lastIncomingTransfer.created : 0;
                const wallet = yield this._walletService.getWallet(config.id, incomingEpoch, undefined);
                if (wallet) {
                    if (wallet.incomingTransfers && wallet.incomingTransfers.length > 0) {
                        this._loggingService.log("basic-producer", `Incoming transfers after ${incomingEpoch}`, wallet.incomingTransfers);
                        for (let i = 0; i < wallet.incomingTransfers.length; i++) {
                            producerState.strategyState.receivedBalance += wallet.incomingTransfers[i].value;
                            if (wallet.incomingTransfers[i].created > incomingEpoch) {
                                incomingEpoch = wallet.incomingTransfers[i].created;
                                producerState.strategyState.lastIncomingTransfer = wallet.incomingTransfers[i];
                            }
                        }
                    }
                }
                updatedState = true;
                producerState.strategyState.lastTransferCheck = now;
            }
            return {
                updatedState
            };
        });
    }
}
exports.BasicProducerStrategy = BasicProducerStrategy;
/**
 * The base for timing.
 */
BasicProducerStrategy.TIME_INTERVAL = 30000;
/**
 * How long do we consider a time before item was idle.
 */
BasicProducerStrategy.TIME_IDLE = 5 * 30000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNQcm9kdWNlclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNQcm9kdWNlclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsZ0VBQTZEO0FBVTdEOztHQUVHO0FBQ0gsTUFBYSxxQkFBcUI7SUFxQjlCOztPQUVHO0lBQ0g7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFpQixRQUFRLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsU0FBUzs7WUFDbEIsT0FBTztnQkFDSCxjQUFjLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDMUIsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsZUFBZSxFQUFFLENBQUM7Z0JBQ2xCLGlCQUFpQixFQUFFLENBQUM7YUFDdkIsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNVLE9BQU8sQ0FDaEIsTUFBOEIsRUFDOUIsZ0JBQXdELEVBQ3hELGFBQWlFOztZQVdqRSxzRkFBc0Y7WUFDdEYsNkZBQTZGO1lBQzdGLHlDQUF5QztZQUN6QyxtRkFBbUY7WUFDbkYsd0ZBQXdGO1lBQ3hGLHNCQUFzQjtZQUN0QixNQUFNLFFBQVEsR0FBNkIsRUFBRSxDQUFDO1lBQzlDLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztZQUV6QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLHFCQUFxQixDQUFDLFNBQVMsRUFBRTtnQkFDdEYsNkRBQTZEO2dCQUM3RCxxQkFBcUI7Z0JBQ3JCLFlBQVksR0FBRyxJQUFJLENB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