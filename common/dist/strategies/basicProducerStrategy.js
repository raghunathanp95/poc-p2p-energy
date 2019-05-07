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
            // Source outputs are discarded after being passed to this method, but you could archive
            // them if you want to
            const commands = [];
            let producerTotal = 0;
            for (const sourceId in sourceOutputById) {
                producerTotal += sourceOutputById[sourceId].map(s => s.output).reduce((a, b) => a + b, 0);
            }
            if (producerTotal > 0) {
                const endTime = producerState.strategyState.lastOutputTime + 10000;
                // Calculate a payment address index to use based on the time, you could just always increment
                // but for this example we will use a new payment address every hour
                const addressIndex = Math.floor((producerState.strategyState.lastOutputTime - producerState.strategyState.initialTime) / 3600000);
                const paymentAddress = core_1.generateAddress(producerState.paymentSeed, addressIndex, 2);
                commands.push({
                    command: "output",
                    startTime: producerState.strategyState.lastOutputTime + 1,
                    endTime,
                    output: producerTotal,
                    // Calculate a cost for the producer output slice
                    // You could base this on your own costs, time of day, value etc
                    // tslint:disable-next-line:insecure-random
                    price: Math.floor(Math.random() * 10) + 1,
                    paymentAddress
                });
                producerState.strategyState.lastOutputTime = endTime;
            }
            return commands;
        });
    }
}
exports.BasicProducerStrategy = BasicProducerStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNQcm9kdWNlclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNQcm9kdWNlclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQ0FBNkM7QUFPN0M7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQUM5Qjs7T0FFRztJQUNVLElBQUk7O1lBQ2IsT0FBTztnQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQzFCLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixXQUFXLEVBQUUsQ0FBQzthQUNqQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDVSxPQUFPLENBQ2hCLGdCQUF3RCxFQUN4RCxhQUFpRTs7WUFDakUsc0ZBQXNGO1lBQ3RGLDZGQUE2RjtZQUM3Rix5Q0FBeUM7WUFDekMsd0ZBQXdGO1lBQ3hGLHNCQUFzQjtZQUN0QixNQUFNLFFBQVEsR0FBNkIsRUFBRSxDQUFDO1lBRTlDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztZQUN0QixLQUFLLE1BQU0sUUFBUSxJQUFJLGdCQUFnQixFQUFFO2dCQUNyQyxhQUFhLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDN0Y7WUFFRCxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUU7Z0JBQ25CLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztnQkFFbkUsOEZBQThGO2dCQUM5RixvRUFBb0U7Z0JBQ3BFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQzNCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxPQUFPLENBQ25HLENBQUM7Z0JBQ0YsTUFBTSxjQUFjLEdBQUcsc0JBQWUsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFbkYsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDVixPQUFPLEVBQUUsUUFBUTtvQkFDakIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLENBQUM7b0JBQ3pELE9BQU87b0JBQ1AsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLGlEQUFpRDtvQkFDakQsZ0VBQWdFO29CQUNoRSwyQ0FBMkM7b0JBQzNDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUN6QyxjQUFjO2lCQUNqQixDQUFDLENBQUM7Z0JBRUgsYUFBYSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO2FBQ3hEO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztLQUFBO0NBQ0o7QUE3REQsc0RBNkRDIn0=