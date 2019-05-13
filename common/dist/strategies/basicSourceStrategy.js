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
 * Basic implementation of a source strategy.
 */
class BasicSourceStrategy {
    /**
     * Initialise the state.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                lastOutputTime: Date.now() - BasicSourceStrategy.TIME_BASIS,
                outputTotal: 0
            };
        });
    }
    /**
     * Gets the output values.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    value(sourceState) {
        return __awaiter(this, void 0, void 0, function* () {
            // For this basic demonstration strategy we just supply a new random value
            // with a time based on a fictional time basis
            // in a real setup this would come from hardware
            const commands = [];
            let updatedState = false;
            const now = Date.now();
            if ((now - sourceState.strategyState.lastOutputTime) > BasicSourceStrategy.TIME_IDLE) {
                // Looks like the source has not been running for some time
                // so create a catchup entry
                commands.push({
                    command: "output",
                    startTime: sourceState.strategyState.lastOutputTime + 1,
                    endTime: now,
                    output: 0
                });
                updatedState = true;
                sourceState.strategyState.lastOutputTime = now;
            }
            else {
                while ((Date.now() - sourceState.strategyState.lastOutputTime) > BasicSourceStrategy.TIME_BASIS) {
                    const endTime = sourceState.strategyState.lastOutputTime + BasicSourceStrategy.TIME_BASIS;
                    // tslint:disable-next-line:insecure-random
                    const output = (Math.random() * 8) + 2;
                    commands.push({
                        command: "output",
                        startTime: sourceState.strategyState.lastOutputTime + 1,
                        endTime: endTime,
                        output
                    });
                    updatedState = true;
                    sourceState.strategyState.lastOutputTime = endTime;
                    sourceState.strategyState.outputTotal += output;
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
BasicSourceStrategy.TIME_BASIS = 30000;
/**
 * How long do we consider a time before item was idle.
 */
BasicSourceStrategy.TIME_IDLE = 5 * 30000;
exports.BasicSourceStrategy = BasicSourceStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNTb3VyY2VTdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJhdGVnaWVzL2Jhc2ljU291cmNlU3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBOztHQUVHO0FBQ0gsTUFBYSxtQkFBbUI7SUFXNUI7O09BRUc7SUFDVSxJQUFJOztZQUNiLE9BQU87Z0JBQ0gsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVO2dCQUMzRCxXQUFXLEVBQUUsQ0FBQzthQUNqQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLEtBQUssQ0FBQyxXQUEyRDs7WUFVMUUsMEVBQTBFO1lBQzFFLDhDQUE4QztZQUM5QyxnREFBZ0Q7WUFDaEQsTUFBTSxRQUFRLEdBQTJCLEVBQUUsQ0FBQztZQUM1QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xGLDJEQUEyRDtnQkFDM0QsNEJBQTRCO2dCQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNWLE9BQU8sRUFBRSxRQUFRO29CQUNqQixTQUFTLEVBQUUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsQ0FBQztvQkFDdkQsT0FBTyxFQUFFLEdBQUc7b0JBQ1osTUFBTSxFQUFFLENBQUM7aUJBQ1osQ0FBQyxDQUFDO2dCQUVILFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQzthQUNsRDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxFQUFFO29CQUM3RixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLENBQUM7b0JBQzFGLDJDQUEyQztvQkFDM0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUV2QyxRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUNWLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixTQUFTLEVBQUUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsQ0FBQzt3QkFDdkQsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLE1BQU07cUJBQ1QsQ0FBQyxDQUFDO29CQUVILFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3BCLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztvQkFDbkQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDO2lCQUNuRDthQUNKO1lBRUQsT0FBTztnQkFDSCxZQUFZO2dCQUNaLFFBQVE7YUFDWCxDQUFDO1FBQ04sQ0FBQztLQUFBOztBQTdFRDs7R0FFRztBQUNxQiw4QkFBVSxHQUFXLEtBQUssQ0FBQztBQUVuRDs7R0FFRztBQUNxQiw2QkFBUyxHQUFXLENBQUMsR0FBRyxLQUFLLENBQUM7QUFUMUQsa0RBK0VDIn0=