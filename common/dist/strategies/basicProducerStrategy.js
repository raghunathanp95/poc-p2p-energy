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
     * @param producerId The id of the producer.
     * @returns The producer state.
     */
    init(producerId) {
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
     * @param producerId The id of the producer.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    sources(producerId, sourceOutputById, producerState) {
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
                        paymentIdOrAddress: producerId
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
     * @param producerId The id of the producer.
     * @param producerState The current state of the producer.
     * @returns If the state was updated.
     */
    payments(producerId, producerState) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedState = false;
            const now = Date.now();
            if (now - producerState.strategyState.lastTransferCheck > 10000) {
                let incomingEpoch = producerState.strategyState.lastIncomingTransfer ?
                    producerState.strategyState.lastIncomingTransfer.created : 0;
                const wallet = yield this._walletService.getWallet(producerId, incomingEpoch, undefined);
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
/**
 * The base for timing.
 */
BasicProducerStrategy.TIME_INTERVAL = 30000;
/**
 * How long do we consider a time before item was idle.
 */
BasicProducerStrategy.TIME_IDLE = 5 * 30000;
exports.BasicProducerStrategy = BasicProducerStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNQcm9kdWNlclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNQcm9kdWNlclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFTN0Q7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQXFCOUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlCLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsSUFBSSxDQUFDLFVBQWtCOztZQUNoQyxPQUFPO2dCQUNILGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUMxQixXQUFXLEVBQUUsQ0FBQztnQkFDZCxlQUFlLEVBQUUsQ0FBQztnQkFDbEIsaUJBQWlCLEVBQUUsQ0FBQzthQUN2QixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsT0FBTyxDQUNoQixVQUFrQixFQUNsQixnQkFBd0QsRUFDeEQsYUFBaUU7O1lBV2pFLHNGQUFzRjtZQUN0Riw2RkFBNkY7WUFDN0YseUNBQXlDO1lBQ3pDLG1GQUFtRjtZQUNuRix3RkFBd0Y7WUFDeEYsc0JBQXNCO1lBQ3RCLE1BQU0sUUFBUSxHQUE2QixFQUFFLENBQUM7WUFDOUMsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcscUJBQXFCLENBQUMsU0FBUyxFQUFFO2dCQUN0Riw2REFBNkQ7Z0JBQzdELHFCQUFxQjtnQkFDckIsWUFBWSxH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