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
                initialTime: Date.now(),
                lastOutputTime: Date.now()
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
            // with a time based on a fictional time basis every 10s
            // in a real setup this would come from hardware
            const commands = [];
            while ((Date.now() - sourceState.strategyState.lastOutputTime) > 10000) {
                const endTime = sourceState.strategyState.lastOutputTime + 10000;
                commands.push({
                    command: "output",
                    startTime: (sourceState.strategyState.lastOutputTime + 1) - sourceState.strategyState.initialTime,
                    endTime: endTime - sourceState.strategyState.initialTime,
                    // tslint:disable-next-line:insecure-random
                    output: Math.random() * 1000
                });
                sourceState.strategyState.lastOutputTime = endTime;
            }
            return commands;
        });
    }
}
exports.BasicSourceStrategy = BasicSourceStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNTb3VyY2VTdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJhdGVnaWVzL2Jhc2ljU291cmNlU3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBOztHQUVHO0FBQ0gsTUFBYSxtQkFBbUI7SUFDNUI7O09BRUc7SUFDVSxJQUFJOztZQUNiLE9BQU87Z0JBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZCLGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2FBQzdCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsS0FBSyxDQUFDLFdBQTJEOztZQUMxRSwwRUFBMEU7WUFDMUUsd0RBQXdEO1lBQ3hELGdEQUFnRDtZQUNoRCxNQUFNLFFBQVEsR0FBMkIsRUFBRSxDQUFDO1lBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLEVBQUU7Z0JBQ3BFLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztnQkFDakUsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDVixPQUFPLEVBQUUsUUFBUTtvQkFDakIsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXO29CQUNqRyxPQUFPLEVBQUUsT0FBTyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVztvQkFDeEQsMkNBQTJDO29CQUMzQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUk7aUJBQy9CLENBQUMsQ0FBQztnQkFFSCxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7YUFDdEQ7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7Q0FDSjtBQXBDRCxrREFvQ0MifQ==