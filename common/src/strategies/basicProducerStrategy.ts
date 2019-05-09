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
     * The base for timing.
     */
    private static readonly TIME_BASIS: number = 30000;

    /**
     * Initialise the state.
     */
    public async init(): Promise<IBasicProducerStrategyState> {
        return {
            initialTime: Date.now(),
            lastOutputTime: Date.now(),
            outputTotal: 0,
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
        producerState: IProducerManagerState<IBasicProducerStrategyState>):
        Promise<{
            /**
             * Has the state been updated.
             */
            updatedState: boolean;
            /**
             * New commands to output.
             */
            commands: IProducerOutputCommand[];
        }> {
        // For this basic strategy we just add the output of the sources together irrespective
        // of the time of day, for a more complicated strategy you could charge more during different
        // time of the day or based on demand etc
        // You would probably also collate the source data based on its time slices as well
        // Source outputs are discarded after being passed to this method, but you could archive
        // them if you want to
        const commands: IProducerOutputCommand[] = [];
        let updatedState = false;

        while ((Date.now() - producerState.strategyState.lastOutputTime) > BasicProducerStrategy.TIME_BASIS) {
            // Find any source data that uses the same time block
            const endTime = producerState.strategyState.lastOutputTime + BasicProducerStrategy.TIME_BASIS;

            let endTimeIndex = Math.floor(
                producerState.strategyState.lastOutputTime / BasicProducerStrategy.TIME_BASIS);

            // Delay the lookup by 30s (or 3 indexes ago) to allow the source data to propogate
            endTimeIndex -= 3;

            let producerTotal = 0;
            for (const sourceId in sourceOutputById) {
                const entryIdx = sourceOutputById[sourceId]
                    .findIndex(u => Math.floor(u.endTime / BasicProducerStrategy.TIME_BASIS) === endTimeIndex);
                if (entryIdx >= 0) {
                    producerTotal += sourceOutputById[sourceId][entryIdx].output;
                    sourceOutputById[sourceId].splice(entryIdx, 1);
                }
            }

            // Calculate a payment address index to use based on the time, you could just always increment
            // but for this example we will use a new payment address every hour
            const addressIndex = Math.floor(
                (producerState.strategyState.lastOutputTime - producerState.strategyState.initialTime) / 3600000
            );
            const paymentAddress = generateAddress(producerState.paymentSeed, addressIndex, 2);

            commands.push({
                command: "output",
                startTime: producerState.strategyState.lastOutputTime + 1,
                endTime: endTime,
                output: producerTotal,
                // Calculate a cost for the producer output slice
                // You could base this on your own costs, time of day, value etc
                // This is a preferred cost and its up to the grid strategy to decide
                // to use it or ignore it
                // tslint:disable-next-line:insecure-random
                price: Math.floor(Math.random() * 10) + 1,
                paymentAddress
            });

            producerState.strategyState.outputTotal += producerTotal;

            producerState.strategyState.lastOutputTime = endTime;
            updatedState = true;
        }

        return {
            updatedState,
            commands
        };
    }
}
