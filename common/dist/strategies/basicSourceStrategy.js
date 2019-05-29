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
     * @param sourceId The id of the source.
     */
    init(sourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                lastOutputTime: Date.now() - BasicSourceStrategy.TIME_BASIS,
                outputTotal: 0
            };
        });
    }
    /**
     * Gets the output values.
     * @param sourceId The id of the source.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    value(sourceId, sourceState) {
        return __awaiter(this, void 0, void 0, function* () {
            // For this basic demonstration strategy we just supply a new random value
            // with a time based on a fictional time basis
            // in a real setup this would come from hardware
            const commands = [];
            let updatedState = false;
            const now = Date.now();
            if ((now - sourceState.strategyState.lastOutputTime) > BasicSourceStrategy.TIME_IDLE) {
                // Looks like the source has not been running for some time
                // so reset the timer
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNTb3VyY2VTdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJhdGVnaWVzL2Jhc2ljU291cmNlU3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBOztHQUVHO0FBQ0gsTUFBYSxtQkFBbUI7SUFXNUI7OztPQUdHO0lBQ1UsSUFBSSxDQUFDLFFBQWdCOztZQUM5QixPQUFPO2dCQUNILGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsbUJBQW1CLENBQUMsVUFBVTtnQkFDM0QsV0FBVyxFQUFFLENBQUM7YUFDakIsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsS0FBSyxDQUFDLFFBQWdCLEVBQUUsV0FBMkQ7O1lBVTVGLDBFQUEwRTtZQUMxRSw4Q0FBOEM7WUFDOUMsZ0RBQWdEO1lBQ2hELE1BQU0sUUFBUSxHQUEyQixFQUFFLENBQUM7WUFDNUMsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxFQUFFO2dCQUNsRiwyREFBMkQ7Z0JBQzNELHFCQUFxQjtnQkFDckIsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO2FBQ2xEO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUU7b0JBQzdGLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztvQkFDMUYsMkNBQTJDO29CQUMzQyxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRXZDLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQ1YsT0FBTyxFQUFFLFFBQVE7d0JBQ2pCLFNBQVMsRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxDQUFDO3dCQUN2RCxPQUFPLEVBQUUsT0FBTzt3QkFDaEIsTUFBTTtxQkFDVCxDQUFDLENBQUM7b0JBRUgsWUFBWSxHQUFHLElBQUksQ0FBQztvQkFDcEIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO29CQUNuRCxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUM7aUJBQ25EO2FBQ0o7WUFFRCxPQUFPO2dCQUNILFlBQVk7Z0JBQ1osUUFBUTthQUNYLENBQUM7UUFDTixDQUFDO0tBQUE7O0FBeEVEOztHQUVHO0FBQ3FCLDhCQUFVLEdBQVcsS0FBSyxDQUFDO0FBRW5EOztHQUVHO0FBQ3FCLDZCQUFTLEdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQVQxRCxrREEwRUMifQ==