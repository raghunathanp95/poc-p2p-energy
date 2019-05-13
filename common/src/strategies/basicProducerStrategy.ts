import { ServiceFactory } from "../factories/serviceFactory";
import { ISourceStoreOutput } from "../models/db/producer/ISourceStoreOutput";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";
import { IPaymentService } from "../models/services/IPaymentService";
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
    private static readonly TIME_INTERVAL: number = 3000;

    /**
     * How long do we consider a time before item was idle.
     */
    private static readonly TIME_IDLE: number = 5 * 30000;

    /**
     * Initialise the state.
     * @param producerId The id of the producer.
     */
    public async init(producerId: string): Promise<IBasicProducerStrategyState> {
        const paymentService = ServiceFactory.get<IPaymentService>("payment");

        await paymentService.register(producerId);

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
     * @param producerId The id of the producer.
     * @param sourceOutputById The unread output from the sources.
     * @param producerState The current state of the producer.
     * @returns The list of commands for the producer to output.
     */
    public async sources(
        producerId: string,
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

        const now = Date.now();
        if ((now - producerState.strategyState.lastOutputTime) > BasicProducerStrategy.TIME_IDLE) {
            // Looks like the producer has not been running for some time
            // so create a catchup entry
            commands.push({
                command: "output",
                startTime: producerState.strategyState.lastOutputTime + 1,
                endTime: now,
                price: 0,
                paymentAddress: "",
                output: 0
            });

            updatedState = true;
            producerState.strategyState.lastOutputTime = now;
        } else {
            while ((Date.now() - producerState.strategyState.lastOutputTime) > BasicProducerStrategy.TIME_INTERVAL) {
                // Find any source data that uses the same time block
                const endTime = producerState.strategyState.lastOutputTime + BasicProducerStrategy.TIME_INTERVAL;

                let endTimeIndex = Math.floor(
                    producerState.strategyState.lastOutputTime / BasicProducerStrategy.TIME_INTERVAL);

                // Delay the lookup by 30s (or 3 indexes ago) to allow the source data to propogate
                endTimeIndex -= 3;

                let producerTotal = 0;
                for (const sourceId in sourceOutputById) {
                    const entryIdx = sourceOutputById[sourceId]
                        .findIndex(u => Math.floor(u.endTime / BasicProducerStrategy.TIME_INTERVAL) === endTimeIndex);
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
                const paymentService = ServiceFactory.get<IPaymentService>("payment");

                const paymentAddress = await paymentService.getAddress(producerId, addressIndex);

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
        }

        return {
            updatedState,
            commands
        };
    }
}
