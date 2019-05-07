import { generateAddress } from "@iota/core";
import { ISourceStoreOutput } from "../models/db/producer/ISourceStoreOutput";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";
import { IProducerManagerState } from "../models/state/IProducerManagerState";
import { IBasicProducerStrategyState } from "../models/strategies/IBasicProducerStrategyState";
import { IProducerStrategy } from "../models/strategies/IProducerStrategy";

/**
 * Basic implementation of a producer strategy.
 */
export class BasicProducerStrategy implements IProducerStrategy<IBasicProducerStrategyState> {
    /**
     * Initialise the state.
     */
    public async init(): Promise<IBasicProducerStrategyState> {
        return {
            initialTime: Date.now(),
            lastOutputTime: Date.now(),
            receivedBalance: 0,
            owedBalance: 0
        };
    }

    /**
     * Collated sources output.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    public async sources(
        sourceOutputById: { [id: string]: ISourceStoreOutput[] },
        producerState: IProducerManagerState<IBasicProducerStrategyState>): Promise<IProducerOutputCommand[]> {
        // For this basic strategy we just add the output of the sources together irrespective
        // of the time of day, for a more complicated strategy you could charge more during different
        // time of the day or based on demand etc
        // Source outputs are discarded after being passed to this method, but you could archive
        // them if you want to
        const commands: IProducerOutputCommand[] = [];

        let producerTotal = 0;
        for (const sourceId in sourceOutputById) {
            producerTotal += sourceOutputById[sourceId].map(s => s.output).reduce((a, b) => a + b, 0);
        }

        if (producerTotal > 0) {
            const endTime = producerState.strategyState.lastOutputTime + 10000;

            // Calculate a payment address index to use based on the time, you could just always increment
            // but for this example we will use a new payment address every hour
            const addressIndex = Math.floor(
                (producerState.strategyState.lastOutputTime - producerState.strategyState.initialTime) / 3600000
            );
            const paymentAddress = generateAddress(producerState.paymentSeed, addressIndex, 2);

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
    }
}
