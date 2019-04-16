import { generateAddress } from "@iota/core";
import { ServiceFactory } from "../factories/serviceFactory";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IProducerConfiguration } from "../models/config/producer/IProducerConfiguration";
import { ISourceStore } from "../models/db/producer/ISourceStore";
import { ISourceStoreOutput } from "../models/db/producer/ISourceStoreOutput";
import { IMamCommand } from "../models/mam/IMamCommand";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";
import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { IRegistrationService } from "../models/services/IRegistrationService";
import { IStorageService } from "../models/services/IStorageService";
import { IRegistration } from "../models/services/registration/IRegistration";
import { IProducerManagerState } from "../models/state/IProducerManagerState";
import { TrytesHelper } from "../utils/trytesHelper";
import { MamCommandChannel } from "./mamCommandChannel";

/**
 * Class to maintain a Producer.
 */
export class ProducerManager {
    /**
     * Configuration for the producer.
     */
    private readonly _config: IProducerConfiguration;

    /**
     * Configuration for the node.
     */
    private readonly _nodeConfig: INodeConfiguration;

    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Registration service.
     */
    private readonly _registrationService: IRegistrationService;

    /**
     * The current state for the producer.
     */
    private _state?: IProducerManagerState;

    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param nodeConfig The configuration for a tangle node.
     */
    constructor(producerConfig: IProducerConfiguration, nodeConfig: INodeConfiguration) {
        this._config = producerConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
        this._registrationService = ServiceFactory.get<IRegistrationService>("producer-registration");
    }

    /**
     * Get the state for the manager.
     */
    public getState(): IProducerManagerState {
        return this._state;
    }

    /**
     * Initialise the producer by registering with the Grid.
     */
    public async initialise(): Promise<void> {
        await this.loadState();

        this._loggingService.log("producer-init", "Registering with Grid");

        await this._registrationService.register(
            this._config.id,
            this._config.name,
            "producer",
            this._state && this._state.channel && this._state.channel.initialRoot,
            this._state && this._state.channel && this._state.channel.sideKey
        );
        this._loggingService.log("producer-init", `Registered with Grid`);

        if (this._state.channel) {
            this._loggingService.log("producer-init", `Channel Config already exists`);
        } else {
            this._loggingService.log("producer-init", `Channel Config not found`);
            this._loggingService.log("producer-init", `Creating Channel`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfig);

            this._state.channel = {};
            await itemMamChannel.openWritable(this._state.channel);

            this._loggingService.log("producer-init", `Creating Channel Success`);

            this._loggingService.log("producer-init", `Updating Registration`);
            await this._registrationService.register(
                this._config.id,
                this._config.name,
                "producer",
                this._state.channel.initialRoot,
                this._state.channel.sideKey
            );
            this._loggingService.log("producer-init", `Updated Registration`);
        }
        this._loggingService.log("producer-init", `Registration Complete`);

        await this.saveState();
    }

    /**
     * Reset the producer channel.
     */
    public async reset(): Promise<void> {
        if (this._state && this._state.channel) {
            this._loggingService.log("producer-reset", `Send Channel Reset`);

            const mamCommandChannel = new MamCommandChannel(this._nodeConfig);
            await mamCommandChannel.reset(this._state.channel);

            await this.saveState();

            this._loggingService.log("producer-reset", `Updating Registration with Grid`);
            await this._registrationService.register(
                this._config.id,
                this._config.name,
                "producer",
                this._state.channel.initialRoot,
                this._state.channel.sideKey
            );
            this._loggingService.log("producer-reset", `Updated Registration with Grid`);
        }
    }

    /**
     * Closedown the producer by unregistering from the Grid.
     */
    public async closedown(): Promise<void> {
        if (this._state && this._state.channel) {
            this._loggingService.log("producer-closedown", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfig);

            await itemMamChannel.closeWritable(this._state.channel);

            this._loggingService.log("producer-closedown", `Sending Goodbye Complete`);

            this._state.channel = undefined;
        }

        this._loggingService.log("producer-closedown", `Unregistering from the Grid`);

        await this._registrationService.unregister(this._config.id);

        this._loggingService.log("producer-closedown", `Unregistered from the Grid`);
    }

    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    public async handleCommands(registration: IRegistration, commands: IMamCommand[]): Promise<void> {
        const sourceStoreService = ServiceFactory.get<IStorageService<ISourceStore>>(
            "producer-source-output-store");
        let store = await sourceStoreService.get(`${this._config.id}/${registration.id}`);
        let updatedStore = false;

        for (let i = 0; i < commands.length; i++) {
            this._loggingService.log("grid", "Processing", commands[i]);
            if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                // This mam channel will have handled any mam operation
                // at the moment there is nothing else for use to do
            } else if (commands[i].command === "output") {
                const outputCommand = <ISourceOutputCommand>commands[i];

                if (!store) {
                    store = {
                        id: registration.id,
                        output: []
                    };
                }

                // Only store output commands that we havent already seen
                if (!store.output.find(o => o.startTime === outputCommand.startTime)) {
                    store.output.push({
                        startTime: outputCommand.startTime,
                        endTime: outputCommand.endTime,
                        output: outputCommand.output
                    });

                    updatedStore = true;
                }
            }
        }

        if (updatedStore) {
            await sourceStoreService.set(`${this._config.id}/${registration.id}`, store);
        }

        this._loggingService.log(
            "producer",
            `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`
        );
    }

    /**
     * Combine the information from the sources and generate an output command.
     * @param endTime The end time of the block we want to collate.
     * @param calculatePrice Calculate the price for an output.
     * @param archiveSourceOutput The source outputs combined are removed, you can archive them with this callback.
     * @returns Any new producer output commands.
     */
    public async update(
        endTime: number,
        calculatePrice: (startTime: number, endTime: number, combinedValue: number) => number,
        archiveSourceOutput: (sourceId: string, archiveOutputs: ISourceStoreOutput[]) => void):
        Promise<IProducerOutputCommand[]> {
        const newCommands = [];
        if (this._state && this._state.channel) {
            const sourceStoreService = ServiceFactory.get<IStorageService<ISourceStore>>(
                "producer-source-output-store");

            let pageResponse;
            // What is the next block we want to collate
            const startTime = this._state.lastOutputTime + 1;
            let totalOutput = 0;
            const idsToRemove = [];
            let pageSize = 10;
            let page = 0;
            do {
                // Get the sources page at a time
                pageResponse = await sourceStoreService.page(this._config.id, page, pageSize);
                if (pageResponse && pageResponse.items) {
                    for (let i = 0; i < pageResponse.items.length; i++) {
                        const sourceStore = pageResponse.items[i];
                        const remaining: ISourceStoreOutput[] = [];
                        const archive: ISourceStoreOutput[] = [];

                        // Are there output entries in the source
                        if (sourceStore.output) {
                            // Walk the outputs from the source
                            for (let j = 0; j < sourceStore.output.length; j++) {
                                // Does the output from the source overlap
                                // with our current collated block
                                const sourceOutput = sourceStore.output[j];
                                if (sourceOutput.startTime < endTime) {
                                    const totalTime = sourceOutput.endTime - sourceOutput.startTime + 1;
                                    // The time used end either at the end of the current collated block
                                    // or the end of the source block
                                    const totalTimeUsed =
                                        (Math.min(endTime, sourceOutput.endTime) -
                                        sourceOutput.startTime) + 1;

                                    // What percentage of the time have we used
                                    const totalTimeUsedPercent = totalTimeUsed / totalTime;

                                    // Calculate how much of the output is used for the time
                                    const totalUsedOutput = totalTimeUsedPercent * sourceOutput.output;

                                    totalOutput += totalUsedOutput;

                                    // Is there any time remaining in the block
                                    if (totalTimeUsed < totalTime) {
                                        // Archive the part of the source we have used
                                        archive.push({
                                            startTime: sourceOutput.startTime,
                                            endTime: endTime,
                                            output: totalUsedOutput
                                        });
                                        // Add a new source block that starts after
                                        // the current collated block and with the output reduced
                                        // by the amount we have collated
                                        remaining.push({
                                            startTime: endTime + 1,
                                            endTime: sourceOutput.endTime,
                                            output: sourceOutput.output - totalUsedOutput
                                        });
                                    } else {
                                        // Used the whole block so archive it
                                        archive.push(sourceOutput);
                                    }
                                } else {
                                    // No overlap so just store the slice again
                                    remaining.push(sourceOutput);
                                }
                            }
                        }
                        if (remaining.length === 0) {
                            // If there are no more outputs in the source remove the storage for it
                            idsToRemove.push(`${this._config.id}/${pageResponse.ids[i]}`);
                        } else {
                            // There are remaining source outputs so save them
                            sourceStore.output = remaining;
                            await sourceStoreService.set(`${this._config.id}/${pageResponse.ids[i]}`, sourceStore);
                        }
                        if (archive.length > 0) {
                            archiveSourceOutput(pageResponse.ids[i], archive);
                        }
                    }
                }
                page++;
                pageSize = pageResponse.pageSize;
            } while (pageResponse && pageResponse.items && pageResponse.items.length > 0);

            // Remove the sources that have no more output
            for (let i = 0; i < idsToRemove.length; i++) {
                await sourceStoreService.remove(idsToRemove[i]);
            }

            if (totalOutput > 0) {
                this._state.lastOutputTime = endTime;

                const paymentAddress = generateAddress(this._state.paymentSeed, this._state.paymentAddressIndex, 2);
                this._state.paymentAddressIndex++;

                const command: IProducerOutputCommand = {
                    command: "output",
                    startTime,
                    endTime,
                    price: calculatePrice(startTime, endTime, totalOutput),
                    output: totalOutput,
                    paymentAddress
                };

                await this.sendCommand(command);

                newCommands.push(command);
            } else {
                await this.saveState();
            }
        }
        return newCommands;
    }

    /**
     * Send a command to the channel.
     */
    public async sendCommand<T extends IMamCommand>(command: T): Promise<void> {
        const mamCommandChannel = new MamCommandChannel(this._nodeConfig);
        await mamCommandChannel.sendCommand(this._state.channel, command);
        await this.saveState();
    }

    /**
     * Load the state for the producer.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IProducerManagerState>>(
            "producer-storage-manager-state");

        this._loggingService.log("producer", `Loading State`);
        this._state = await storageConfigService.get(this._config.id);
        this._loggingService.log("producer", `Loaded State`);

        this._state = this._state || {
            paymentSeed: TrytesHelper.generateHash(),
            paymentAddressIndex: 0,
            lastOutputTime: 0,
            owedBalance: 0,
            receivedBalance: 0
        };
    }

    /**
     * Store the state for the producer.
     */
    private async saveState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IProducerManagerState>>(
            "producer-storage-manager-state");

        this._loggingService.log("producer", `Storing State`);
        await storageConfigService.set(this._config.id, this._state);
        this._loggingService.log("producer", `Storing State Complete`);
    }
}
