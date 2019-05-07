import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../models/state/ISourceManagerState";
import { IBasicSourceStrategyState } from "../models/strategies/IBasicSourceStrategyState";
import { ISourceStrategy } from "../models/strategies/ISourceStrategy";

/**
 * Basic implementation of a source strategy.
 */
export class BasicSourceStrategy implements ISourceStrategy<IBasicSourceStrategyState> {
    /**
     * Initialise the state.
     */
    public async init(): Promise<IBasicSourceStrategyState> {
        return {
            initialTime: Date.now(),
            lastOutputTime: Date.now()
        };
    }

    /**
     * Gets the output values.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    public async value(sourceState: ISourceManagerState<IBasicSourceStrategyState>): Promise<ISourceOutputCommand[]> {
        // For this basic demonstration strategy we just supply a new random value
        // with a time based on a fictional time basis every 10s
        // in a real setup this would come from hardware
        const commands: ISourceOutputCommand[] = [];
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
    }
}
