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
const core_1 = require("@iota/core");
/**
 * Basic implementation of a producer strategy.
 */
class BasicProducerStrategy {
    /**
     * Initialise the state.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
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
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    sources(sourceOutputById, producerState) {
        return __awaiter(this, void 0, void 0, function* () {
            // For this basic strategy we just add the output of the sources together irrespective
            // of the time of day, for a more complicated strategy you could charge more during different
            // time of the day or based on demand etc
            // You would probably also collate the source data based on its time slices as well
            // Source outputs are discarded after being passed to this method, but you could archive
            // them if you want to
            const commands = [];
            let updatedState = false;
            while ((Date.now() - producerState.strategyState.lastOutputTime) > BasicProducerStrategy.TIME_BASIS) {
                // Find any source data that uses the same time block
                const endTime = producerState.strategyState.lastOutputTime + BasicProducerStrategy.TIME_BASIS;
                let endTimeIndex = Math.floor(producerState.strategyState.lastOutputTime / BasicProducerStrategy.TIME_BASIS);
                // Delay the lookup by 30s (or 3 indexes ago) to allow the source data to propogate
                endTimeIndex -= 3;
                let producerTotal = 0;
                for (const sourceId in sourceOutputById) {
                    const entryIdx = sourceOutputById[sourceId]
                        .findIndex(u => Math.floor(u.endTime / BasicProducerStrategy.TIME_BASIS) === endTimeIndex);
                    if (entryIdx >= 0) {
                        producerTotal += sourceOutputById[sourceId][entryIdx].output;
                        sourceOutputById[sourceId].splice(entryIdx, 1);
                    }
                }
                // Calculate a payment address index to use based on the time, you could just always increment
                // but for this example we will use a new payment address every hour
                const addressIndex = Math.floor((producerState.strategyState.lastOutputTime - producerState.strategyState.initialTime) / 3600000);
                const paymentAddress = core_1.generateAddress(producerState.paymentSeed, addressIndex, 2);
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
BasicProducerStrategy.TIME_BASIS = 30000;
exports.BasicProducerStrategy = BasicProducerStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNQcm9kdWNlclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNQcm9kdWNlclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQ0FBNkM7QUFPN0M7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQU05Qjs7T0FFRztJQUNVLElBQUk7O1lBQ2IsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQzFCLFdBQVcsRUFBRSxDQUFDO2dCQUNkLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixXQUFXLEVBQUUsQ0FBQzthQUNqQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDVSxPQUFPLENBQ2hCLGdCQUF3RCxFQUN4RCxhQUFpRTs7WUFXakUsc0ZBQXNGO1lBQ3RGLDZGQUE2RjtZQUM3Rix5Q0FBeUM7WUFDekMsbUZBQW1GO1lBQ25GLHdGQUF3RjtZQUN4RixzQkFBc0I7WUFDdEIsTUFBTSxRQUFRLEdBQTZCLEVBQUUsQ0FBQztZQUM5QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFekIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLHFCQUFxQixDQUFDLFVBQVUsRUFBRTtnQkFDakcscURBQXFEO2dCQUNyRCxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxVQUFVLENBQUM7Z0JBRTlGLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQ3pCLGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUVuRixtRkFBbUY7Z0JBQ25GLFlBQVksSUFBSSxDQUFDLENBQUM7Z0JBRWxCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxnQkFBZ0IsRUFBRTtvQkFDckMsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO3lCQUN0QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUMsVUFBVSxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7b0JBQy9GLElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTt3QkFDZixhQUFhLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUM3RCxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUNsRDtpQkFDSjtnQkFFRCw4RkFBOEY7Z0JBQzlGLG9FQUFvRTtnQkFDcEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDM0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxHQUFHLE9BQU8sQ0FDbkcsQ0FBQztnQkFDRixNQUFNLGNBQWMsR0FBRyxzQkFBZSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUVuRixRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNWLE9BQU8sRUFBRSxRQUFRO29CQUNqQixTQUFTLEVBQUUsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsQ0FBQztvQkFDekQsT0FBTyxFQUFFLE9BQU87b0JBQ2hCLE1BQU0sRUFBRSxhQUFhO29CQUNyQixpREFBaUQ7b0JBQ2pELGdFQUFnRTtvQkFDaEUscUVBQXFFO29CQUNyRSx5QkFBeUI7b0JBQ3pCLDJDQUEyQztvQkFDM0MsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ3pDLGNBQWM7aUJBQ2pCLENBQUMsQ0FBQztnQkFFSCxhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVcsSUFBSSxhQUFhLENBQUM7Z0JBRXpELGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztnQkFDckQsWUFBWSxHQUFHLElBQUksQ0FBQzthQUN2QjtZQUVELE9BQU87Z0JBQ0gsWUFBWTtnQkFDWixRQUFRO2FBQ1gsQ0FBQztRQUNOLENBQUM7S0FBQTs7QUFqR0Q7O0dBRUc7QUFDcUIsZ0NBQVUsR0FBVyxLQUFLLENBQUM7QUFKdkQsc0RBbUdDIn0=