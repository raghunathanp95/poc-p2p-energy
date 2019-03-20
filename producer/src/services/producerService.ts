import { generateAddress } from "@iota/core";
import { ILoggingService, IMamCommand, INodeConfiguration, IProducerOutputCommand, IRegistration, ISourceOutputCommand, IStorageService, MamCommandChannel, RegistrationApiClient, ServiceFactory, TrytesHelper } from "poc-p2p-energy-grid-common";
import { ISourceStore } from "../models/db/ISourceStore";
import { ISourceStoreOutput } from "../models/db/ISourceStoreOutput";
import { IProducerConfiguration } from "../models/IProducerConfiguration";
import { IProducerState } from "../models/IProducerState";

/**
 * Class to maintain a Producer.
 */
export class ProducerService {
    /**
     * Configuration for the producer.
     */
    private readonly _config: IProducerConfiguration;

    /**
     * Configuration for the node.
     */
    private readonly _nodeConfiguration: INodeConfiguration;

    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Configuration for the grid api.
     */
    private readonly _gridApiEndpoint: string;

    /**
     * The current state for the producer.
     */
    private _state?: IProducerState;

    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param gridApiEndpoint The grid api endpoint.
     * @param nodeConfig The configuration for a tangle node.
     */
    constructor(
        producerConfig: IProducerConfiguration,
        gridApiEndpoint: string,
        nodeConfig: INodeConfiguration) {
        this._config = producerConfig;
        this._nodeConfiguration = nodeConfig;
        this._gridApiEndpoint = gridApiEndpoint;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Intialise the producer by registering with the Grid.
     */
    public async initialise(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);

        await this.loadState();

        this._loggingService.log("producer-init", "Registering with Grid");

        const response = await registrationApiClient.registrationSet({
            registrationId: this._config.id,
            itemName: this._config.name,
            itemType: "producer",
            sideKey: this._state && this._state.channel && this._state.channel.sideKey,
            root: this._state && this._state.channel && this._state.channel.initialRoot
        });
        this._loggingService.log("producer-init", `Registering with Grid: ${response.message}`);

        if (this._state.channel) {
            this._loggingService.log("producer-init", `Channel Config already exists`);
        } else {
            this._loggingService.log("producer-init", `Channel Config not found`);
            this._loggingService.log("producer-init", `Creating Channel`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            this._state.channel = {};
            await itemMamChannel.openWritable(this._state.channel);

            this._loggingService.log("producer-init", `Creating Channel Success`);

            await this.saveState();

            this._loggingService.log("producer-init", `Updating Registration`);
            const updateResponse = await registrationApiClient.registrationSet({
                registrationId: this._config.id,
                sideKey: this._state.channel.sideKey,
                root: this._state.channel.initialRoot
            });
            this._loggingService.log("producer-init", `Updating Registration: ${updateResponse.message}`);
        }
        this._loggingService.log("producer-init", `Registration Complete`);
    }

    /**
     * Reset the producer channel.
     */
    public async reset(): Promise<void> {
        if (this._state && this._state.channel) {
            this._loggingService.log("producer-reset", `Send Channel Reset`);

            const mamCommandChannel = new MamCommandChannel(this._nodeConfiguration);
            await mamCommandChannel.reset(this._state.channel);

            await this.saveState();

            this._loggingService.log("producer-reset", `Updating Registration with Grid`);
            const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);
            const updateResponse = await registrationApiClient.registrationSet({
                registrationId: this._config.id,
                sideKey: this._state.channel.sideKey,
                root: this._state.channel.initialRoot
            });
            this._loggingService.log("producer-reset", `Updating Registration with Grid: ${updateResponse.message}`);
        }
    }

    /**
     * Closedown the producer by unregistering from the Grid.
     */
    public async closedown(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);

        if (this._state && this._state.channel) {
            this._loggingService.log("producer-closedown", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            await itemMamChannel.closeWritable(this._state.channel);

            this._loggingService.log("producer-closedown", `Sending Goodbye Complete`);

            this._state.channel = undefined;
        }

        this._loggingService.log("producer-closedown", `Unregistering from the Grid`);

        const response = await registrationApiClient.registrationDelete({
            registrationId: this._config.id
        });

        this._loggingService.log("producer-closedown", `Unregistering from the Grid: ${response.message}`);
    }

    /**
     * Combine the information from the sources and generate an output command.
     * @param calculatePrice Calculate the price for an output.
     */
    public async collateSources(
        calculatePrice: (startTime: number, endTime: number, value: number) => number): Promise<void> {
        if (this._state && this._state.channel) {
            const sourceStoreService = ServiceFactory.get<IStorageService<ISourceStore>>("source-store");
            const paymentAddress = generateAddress(this._state.paymentSeed, this._state.paymentAddressIndex, 2);
            this._state.paymentAddressIndex++;

            let sources;
            // What is the next block we want to collate
            const startTime = this._state.lastOutputTime + 1;
            const endTime = Date.now();
            let totalOutput = 0;
            const idsToRemove = [];
            let page = 0;
            do {
                // Get the sources page at a time
                sources = await sourceStoreService.page(undefined, page, 20);
                if (sources && sources.items) {
                    for (let i = 0; i < sources.items.length; i++) {
                        const sourceStore = sources.items[i];
                        const remaining: ISourceStoreOutput[] = [];

                        // Are there output entries in the source
                        if (sourceStore.output) {
                            // Walk the outputs from the source
                            for (let j = 0; j < sourceStore.output.length; j++) {
                                // Does the output from the source overlap
                                // with our current collated block
                                if (sourceStore.output[j].startTime < endTime) {
                                    const totalTime = sourceStore.output[j].endTime - sourceStore.output[j].startTime;
                                    // The time used end either at the end of the current collated block
                                    // or the end of the source block
                                    const totalTimeUsed =
                                        Math.min(endTime, sourceStore.output[j].endTime) -
                                        sourceStore.output[j].startTime;

                                    // What percentage of the time have we used
                                    const totalTimeUsedPercent = totalTimeUsed / totalTime;

                                    // Calculate how much of the output is used for the time
                                    const totalUsedOutput = totalTimeUsedPercent * sourceStore.output[j].output;

                                    totalOutput += totalUsedOutput;

                                    // Is there any time remaining in the block
                                    if (totalTimeUsed < totalTime) {
                                        // Added a new source block that starts after
                                        // the current collated block and with the output reduced
                                        // by the amount we have collated
                                        remaining.push({
                                            startTime: endTime + 1,
                                            endTime: sourceStore.output[j].endTime,
                                            output: sourceStore.output[j] - totalUsedOutput
                                        });
                                    }
                                } else {
                                    // No overlap so just store the block
                                    remaining.push(sourceStore.output[j]);
                                }
                            }
                        }
                        if (remaining.length === 0) {
                            // If there are no more outputs in the source remove the storage for it
                            idsToRemove.push(sources.ids[i]);
                        } else {
                            // There are remaining source outputs so save them
                            sourceStore.output = remaining;
                            await sourceStoreService.set(sources.ids[i], sourceStore);
                        }
                    }
                }
                page++;
            } while (sources && sources.items && sources.items.length > 0);

            // Remove the sources that have no more output
            for (let i = 0; i < idsToRemove.length; i++) {
                await sourceStoreService.remove(idsToRemove[i]);
            }

            this._state.lastOutputTime = endTime;

            if (totalOutput > 0) {
                const command: IProducerOutputCommand = {
                    command: "output",
                    startTime,
                    endTime,
                    askingPrice: calculatePrice(startTime, endTime, totalOutput),
                    output: totalOutput,
                    paymentAddress
                };

                await this.sendCommand(command);
            } else {
                await this.saveState();
            }
        }
    }

    /**
     * Should we create a return channel when adding a registration.
     * @param registration The registration to check.
     */
    public shouldCreateReturnChannel(registration: IRegistration): boolean {
        return false;
    }

    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    public async handleCommands(registration: IRegistration, commands: IMamCommand[]): Promise<void> {
        const sourceStoreService = ServiceFactory.get<IStorageService<ISourceStore>>("source-store");
        let store = await sourceStoreService.get(registration.id);
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
            await sourceStoreService.set(registration.id, store);
        }

        this._loggingService.log(
            "producer",
            `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`
        );
    }

    /**
     * Send a command to the channel.
     */
    public async sendCommand<T extends IMamCommand>(command: T): Promise<void> {
        const mamCommandChannel = new MamCommandChannel(this._nodeConfiguration);
        await mamCommandChannel.sendCommand(this._state.channel, command);
        await this.saveState();
    }

    /**
     * Load the state for the producer.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IProducerState>>("storage-config");

        this._loggingService.log("producer-init", `Loading State`);
        this._state = await storageConfigService.get("state");
        this._loggingService.log("producer-init", `Loaded State`);

        this._state = this._state || {
            paymentSeed: TrytesHelper.generateHash(),
            paymentAddressIndex: 0,
            lastOutputTime: Date.now()
        };
    }

    /**
     * Store the state for the producer.
     */
    private async saveState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IProducerState>>("storage-config");

        this._loggingService.log("producer", `Storing State`);
        await storageConfigService.set("state", this._state);
        this._loggingService.log("producer", `Storing State Complete`);
    }
}
