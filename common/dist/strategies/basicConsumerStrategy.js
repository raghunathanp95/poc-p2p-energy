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
/**
 * Basic implementation of a consumer strategy.
 */
class BasicConsumerStrategy {
    /**
     * Initialise the state.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
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
     * @param consumerState The state for the manager calling the strategy
     * @returns List of usage commands.
     */
    usage(consumerState) {
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
     * @param consumerState The state for the manager calling the strategy
     * @param paymentRequests Payment requests to process.
     */
    paymentRequests(consumerState, paymentRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            consumerState.strategyState.outstandingBalance += paymentRequests.reduce((a, b) => a + b.owed, 0);
            return {
                updatedState: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNDb25zdW1lclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNDb25zdW1lclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQTs7R0FFRztBQUNILE1BQWEscUJBQXFCO0lBVzlCOztPQUVHO0lBQ1UsSUFBSTs7WUFDYixPQUFPO2dCQUNILFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUN2QixhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDekIsVUFBVSxFQUFFLENBQUM7Z0JBQ2IsV0FBVyxFQUFFLENBQUM7Z0JBQ2Qsa0JBQWtCLEVBQUUsQ0FBQzthQUN4QixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLEtBQUssQ0FBQyxhQUFpRTs7WUFXaEYsMEVBQTBFO1lBQzFFLDhDQUE4QztZQUM5Qyw2REFBNkQ7WUFDN0QsTUFBTSxRQUFRLEdBQTRCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JGLDZEQUE2RDtnQkFDN0QsNEJBQTRCO2dCQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNWLE9BQU8sRUFBRSxPQUFPO29CQUNoQixTQUFTLEVBQUUsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEdBQUcsQ0FBQztvQkFDeEQsT0FBTyxFQUFFLEdBQUc7b0JBQ1osS0FBSyxFQUFFLENBQUM7aUJBQ1gsQ0FBQyxDQUFDO2dCQUVILFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQzthQUNuRDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcscUJBQXFCLENBQUMsVUFBVSxFQUFFO29CQUNoRyxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxVQUFVLENBQUM7b0JBQzdGLDJDQUEyQztvQkFDM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUNWLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixTQUFTLEVBQUUsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEdBQUcsQ0FBQzt3QkFDeEQsT0FBTzt3QkFDUCxLQUFLO3FCQUNSLENBQUMsQ0FBQztvQkFFSCxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUNwQixhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7b0JBQ3BELGFBQWEsQ0FBQyxhQUFhLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztpQkFDbkQ7YUFDSjtZQUVELE9BQU87Z0JBQ0gsWUFBWTtnQkFDWixRQUFRO2FBQ1gsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxlQUFlLENBQ3hCLGFBQWlFLEVBQ2pFLGVBQWlEOztZQVFqRCxhQUFhLENBQUMsYUFBYSxDQUFDLGtCQUFrQixJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVsRyxPQUFPO2dCQUNILFlBQVksRUFBRSxJQUFJO2FBQ3JCLENBQUM7UUFDTixDQUFDO0tBQUE7O0FBdEdEOztHQUVHO0FBQ3FCLGdDQUFVLEdBQVcsS0FBSyxDQUFDO0FBRW5EOztHQUVHO0FBQ3FCLCtCQUFTLEdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQVQxRCxzREF3R0MifQ==