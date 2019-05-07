import { IConsumerUsageCommand } from "../models/mam/IConsumerUsageCommand";
import { IConsumerManagerState } from "../models/state/IConsumerManagerState";
import { IBasicConsumerStrategyState } from "../models/strategies/IBasicConsumerStrategyState";
import { IConsumerStrategy } from "../models/strategies/IConsumerStrategy";

/**
 * Basic implementation of a consumer strategy.
 */
export class BasicConsumerStrategy implements IConsumerStrategy<IBasicConsumerStrategyState> {
    /**
     * Initialise the state.
     */
    public async init(): Promise<IBasicConsumerStrategyState> {
        return {
            initialTime: Date.now(),
            lastUsageTime: Date.now()
        };
    }

    /**
     * Gets the usage values.
     * @param consumerState The state for the manager calling the strategy
     * @returns List of usage commands.
     */
    public async usage(consumerState: IConsumerManagerState<IBasicConsumerStrategyState>):
        Promise<IConsumerUsageCommand[]> {
        // For this basic demonstration strategy we just supply a new random value
        // with a time based on a fictional time basis every 10s
        // in a real setup this would come from hardware like a meter
        const commands: IConsumerUsageCommand[] = [];
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
    }
}
