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
     * Initialise the state.
     * @param producerId The id of the producer.
     */
    init(producerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentService = serviceFactory_1.ServiceFactory.get("payment");
            yield paymentService.register(producerId);
            return {
                initialTime: Date.now(),
                lastOutputTime: Date.now(),
                outputTotal: 0,
                receivedBalance: 0,
                owedBalance: 0
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
                // so create a catchup entry
                commands.push({
                    command: "output",
                    startTime: producerState.strategyState.lastOutputTime + 1,
                    endTime: now,
                    price: 0,
                    paymentAddress: "",
                    output: 0
                });
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
                    // Calculate a payment address index to use based on the time, you could just always increment
                    // but for this example we will use a new payment address every hour
                    const addressIndex = Math.floor((producerState.strategyState.lastOutputTime - producerState.strategyState.initialTime) / 3600000);
                    const paymentService = serviceFactory_1.ServiceFactory.get("payment");
                    const paymentAddress = yield paymentService.getAddress(producerId, addressIndex);
                    commands.push({
                        command: "output",
                        startTime: producerState.strategyState.lastOutputTime + 1,
                        endTime: endTime,
                        output: producerTotal,
                        // Calculate a cost for the producer output slice
                        // You could base this on your own costs, time of day, value etc
                        // This is a preferred cost and its up to the grid strategy to decide
                        // to use it or ignore it
                        // tslint:disable-next-line:insecure-random
                        price: Math.floor(Math.random() * 10) + 1,
                        paymentAddress
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
}
/**
 * The base for timing.
 */
BasicProducerStrategy.TIME_INTERVAL = 3000;
/**
 * How long do we consider a time before item was idle.
 */
BasicProducerStrategy.TIME_IDLE = 5 * 30000;
exports.BasicProducerStrategy = BasicProducerStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNQcm9kdWNlclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNQcm9kdWNlclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFRN0Q7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQVc5Qjs7O09BR0c7SUFDVSxJQUFJLENBQUMsVUFBa0I7O1lBQ2hDLE1BQU0sY0FBYyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztZQUV0RSxNQUFNLGNBQWMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFMUMsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQzFCLFdBQVcsRUFBRSxDQUFDO2dCQUNkLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixXQUFXLEVBQUUsQ0FBQzthQUNqQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsT0FBTyxDQUNoQixVQUFrQixFQUNsQixnQkFBd0QsRUFDeEQsYUFBaUU7O1lBV2pFLHNGQUFzRjtZQUN0Riw2RkFBNkY7WUFDN0YseUNBQXlDO1lBQ3pDLG1GQUFtRjtZQUNuRix3RkFBd0Y7WUFDeEYsc0JBQXNCO1lBQ3RCLE1BQU0sUUFBUSxHQUE2QixFQUFFLENBQUM7WUFDOUMsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcscUJBQXFCLENBQUMsU0FBUyxFQUFFO2dCQUN0Riw2REFBNkQ7Z0JBQzdELDRCQUE0QjtnQkFDNUIsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDVixPQUFPLEVBQUUsUUFBUTtvQkFDakIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLENBQUM7b0JBQ3pELE9BQU8sRUFBRSxHQUFHO29CQUNaLEtBQUssRUFBRSxDQUFDO29CQUNSLGNBQWMsRUFBRSxFQUFFO29CQUNsQixNQUFNLEVBQUUsQ0FBQztpQkFDWixDQUFDLENBQUM7Z0JBRUgsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO2FBQ3BEO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUU7b0JBQ3BHLHFEQUFxRDtvQkFDckQsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcscUJBQXFCLENBQUMsYUFBYSxDQUFDO29CQUVqRyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUN6QixhQUFhLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFdEYsbUZBQW1GO29CQUNuRixZQUFZLElBQUksQ0FBQyxDQUFDO29CQUVsQixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLEtBQUssTUFBTSxRQUFRLElBQUksZ0JBQWdCLEVBQUU7d0JBQ3JDLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQzs2QkFDdEMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDO3dCQUNsRyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7NEJBQ2YsYUFBYSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs0QkFDN0QsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDbEQ7cUJBQ0o7b0JBRUQsOEZBQThGO29CQUM5RixvRUFBb0U7b0JBQ3BFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQzNCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxPQUFPLENBQ25HLENBQUM7b0JBQ0YsTUFBTSxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO29CQUV0RSxNQUFNLGNBQWMsR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUVqRixRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUNWLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixTQUFTLEVBQUUsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsQ0FBQzt3QkFDekQsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLE1BQU0sRUFBRSxhQUFhO3dCQUNyQixpREFBaUQ7d0JBQ2pELGdFQUFnRTt3QkFDaEUscUVBQXFFO3dCQUNyRSx5QkFBeUI7d0JBQ3pCLDJDQUEyQzt3QkFDM0MsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQ3pDLGNBQWM7cUJBQ2pCLENBQUMsQ0FBQztvQkFFSCxhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVcsSUFBSSxhQUFhLENBQUM7b0JBRXpELGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztvQkFDckQsWUFBWSxHQUFHLElBQUksQ0FBQztpQkFDdkI7YUFDSjtZQUVELE9BQU87Z0JBQ0gsWUFBWTtnQkFDWixRQUFRO2FBQ1gsQ0FBQztRQUNOLENBQUM7S0FBQTs7QUFoSUQ7O0dBRUc7QUFDcUIsbUNBQWEsR0FBVyxJQUFJLENBQUM7QUFFckQ7O0dBRUc7QUFDcUIsK0JBQVMsR0FBVyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBVDFELHNEQWtJQyJ9