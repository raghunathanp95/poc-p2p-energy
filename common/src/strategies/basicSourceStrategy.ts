import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ISourceManagerState } from "../models/state/ISourceManagerState";
import { IBasicSourceStrategyState } from "../models/strategies/IBasicSourceStrategyState";
import { ISourceStrategy } from "../models/strategies/ISourceStrategy";

/**
 * Basic implementation of a source strategy.
 */
export class BasicSourceStrategy implements ISourceStrategy<IBasicSourceStrategyState> {
    /**
     * The base for timing.
     */
    private static readonly TIME_BASIS: number = 30000;

    /**
     * How long do we consider a time before item was idle.
     */
    private static readonly TIME_IDLE: number = 5 * 30000;

    /**
     * Initialise the state.
     */
    public async init(): Promise<IBasicSourceStrategyState> {
        return {
            lastOutputTime: Date.now() - BasicSourceStrategy.TIME_BASIS,
            outputTotal: 0
        };
    }

    /**
     * Gets the output values.
     * @param sourceState The state for the manager calling the strategy
     * @returns List of output commands.
     */
    public async value(sourceState: ISourceManagerState<IBasicSourceStrategyState>): Promise<{
        /**
         * Has the state been updated.
         */
        updatedState: boolean;
        /**
         * New commands to output.
         */
        commands: ISourceOutputCommand[];
    }> {
        // For this basic demonstration strategy we just supply a new random value
        // with a time based on a fictional time basis
        // in a real setup this would come from hardware
        const commands: ISourceOutputCommand[] = [];
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
        } else {
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
    }
}
