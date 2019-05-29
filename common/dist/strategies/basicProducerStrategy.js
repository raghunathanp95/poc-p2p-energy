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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNQcm9kdWNlclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNQcm9kdWNlclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFTN0Q7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQXFCOUI7O09BRUc7SUFDSDtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWlCLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7O09BR0c7SUFDVSxJQUFJLENBQUMsVUFBa0I7O1lBQ2hDLE9BQU87Z0JBQ0gsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQzFCLFdBQVcsRUFBRSxDQUFDO2dCQUNkLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixpQkFBaUIsRUFBRSxDQUFDO2FBQ3ZCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDVSxPQUFPLENBQ2hCLFVBQWtCLEVBQ2xCLGdCQUF3RCxFQUN4RCxhQUFpRTs7WUFXakUsc0ZBQXNGO1lBQ3RGLDZGQUE2RjtZQUM3Rix5Q0FBeUM7WUFDekMsbUZBQW1GO1lBQ25GLHdGQUF3RjtZQUN4RixzQkFBc0I7WUFDdEIsTUFBTSxRQUFRLEdBQTZCLEVBQUUsQ0FBQztZQUM5QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3RGLDZEQUE2RDtnQkFDN0QscUJBQXFCO2dCQUNyQixZQUFZLEdB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