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
                lastUsageTime: Date.now()
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
            // with a time based on a fictional time basis every 10s
            // in a real setup this would come from hardware like a meter
            const commands = [];
            while ((Date.now() - consumerState.strategyState.lastUsageTime) > 10000) {
                const endTime = consumerState.strategyState.lastUsageTime + 10000;
                commands.push({
                    command: "output",
                    startTime: (consumerState.strategyState.lastUsageTime + 1) - consumerState.strategyState.initialTime,
                    endTime: endTime - consumerState.strategyState.initialTime,
                    // tslint:disable-next-line:insecure-random
                    usage: Math.random() * 10
                });
                consumerState.strategyState.lastUsageTime = endTime;
            }
            return commands;
        });
    }
}
exports.BasicConsumerStrategy = BasicConsumerStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNDb25zdW1lclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNDb25zdW1lclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQTs7R0FFRztBQUNILE1BQWEscUJBQXFCO0lBQzlCOztPQUVHO0lBQ1UsSUFBSTs7WUFDYixPQUFPO2dCQUNILFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUN2QixhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTthQUM1QixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLEtBQUssQ0FBQyxhQUFpRTs7WUFFaEYsMEVBQTBFO1lBQzFFLHdEQUF3RDtZQUN4RCw2REFBNkQ7WUFDN0QsTUFBTSxRQUFRLEdBQTRCLEVBQUUsQ0FBQztZQUM3QyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxFQUFFO2dCQUNyRSxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQ2xFLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ1YsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVztvQkFDcEcsT0FBTyxFQUFFLE9BQU8sR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVc7b0JBQzFELDJDQUEyQztvQkFDM0MsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO2lCQUM1QixDQUFDLENBQUM7Z0JBRUgsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDO2FBQ3ZEO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztLQUFBO0NBQ0o7QUFyQ0Qsc0RBcUNDIn0=