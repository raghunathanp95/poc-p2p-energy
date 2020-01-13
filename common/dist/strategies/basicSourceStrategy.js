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
/**
 * Basic implementation of a source strategy.
 */
class BasicSourceStrategy {
    /**
     * Initialise the state.
     * @returns The source state.
     */
    initState() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                lastOutputTime: Date.now() - BasicSourceStrategy.TIME_BASIS,
                outputTotal: 0
            };
        });
    }
    /**
     * Gets the output values.
     * @param config The id of the source.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    value(config, sourceState) {
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
                    const extProps = config.extendedProperties || {};
                    const output = extProps.outputType === "fixed" && extProps.outputValue !== undefined
                        ? extProps.outputValue
                        // tslint:disable-next-line:insecure-random
                        : (Math.random() * 8) + 2;
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
exports.BasicSourceStrategy = BasicSourceStrategy;
/**
 * The base for timing.
 */
BasicSourceStrategy.TIME_BASIS = 30000;
/**
 * How long do we consider a time before item was idle.
 */
BasicSourceStrategy.TIME_IDLE = 5 * 30000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNTb3VyY2VTdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJhdGVnaWVzL2Jhc2ljU291cmNlU3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFNQTs7R0FFRztBQUNILE1BQWEsbUJBQW1CO0lBVzVCOzs7T0FHRztJQUNVLFNBQVM7O1lBQ2xCLE9BQU87Z0JBQ0gsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVO2dCQUMzRCxXQUFXLEVBQUUsQ0FBQzthQUNqQixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDVSxLQUFLLENBQ2QsTUFBNEIsRUFDNUIsV0FBMkQ7O1lBVTNELDBFQUEwRTtZQUMxRSw4Q0FBOEM7WUFDOUMsZ0RBQWdEO1lBQ2hELE1BQU0sUUFBUSxHQUEyQixFQUFFLENBQUM7WUFDNUMsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxFQUFFO2dCQUNsRiwyREFBMkQ7Z0JBQzNELHFCQUFxQjtnQkFDckIsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO2FBQ2xEO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUU7b0JBQzdGLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztvQkFDMUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztvQkFDakQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFVBQVUsS0FBSyxPQUFPLElBQUksUUFBUSxDQUFDLFdBQVcsS0FBSyxTQUFTO3dCQUNoRixDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVc7d0JBQ3RCLDJDQUEyQzt3QkFDM0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFOUIsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDVixPQUFPLEVBQUUsUUFBUTt3QkFDakIsU0FBUyxFQUFFLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLENBQUM7d0JBQ3ZELE9BQU8sRUFBRSxPQUFPO3dCQUNoQixNQUFNO3FCQUNULENBQUMsQ0FBQztvQkFFSCxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUNwQixXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7b0JBQ25ELFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQztpQkFDbkQ7YUFDSjtZQUVELE9BQU87Z0JBQ0gsWUFBWTtnQkFDWixRQUFRO2FBQ1gsQ0FBQztRQUNOLENBQUM7S0FBQTs7QUE5RUwsa0RBK0VDO0FBOUVHOztHQUVHO0FBQ3FCLDhCQUFVLEdBQVcsS0FBSyxDQUFDO0FBRW5EOztHQUVHO0FBQ3FCLDZCQUFTLEdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQyJ9