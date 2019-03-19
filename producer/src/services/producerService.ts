import {
    ILoggingService,
    IMamChannelConfiguration,
    IMamCommand,
    INodeConfiguration,
    IRegistration,
    IResponse,
    MamCommandChannel,
    RegistrationApiClient,
    ServiceFactory,
    StorageApiClient
} from "poc-p2p-energy-grid-common";
import { IProducerConfiguration } from "../models/IProducerConfiguration";
import { IProducerOutputCommand } from "../models/mam/IProducerOutputCommand";

/**
 * Class to maintain a Producer.
 */
export class ProducerService {
    /**
     * Configuration for the producer.
     */
    private readonly _producerConfig: IProducerConfiguration;

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
     * The channel configuration for the producer.
     */
    private _producerChannelConfiguration?: IMamChannelConfiguration;

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
        this._producerConfig = producerConfig;
        this._nodeConfiguration = nodeConfig;
        this._gridApiEndpoint = gridApiEndpoint;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Intialise the producer by registering with the Grid.
     */
    public async initialise(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);
        const storageApiClient = new StorageApiClient(this._gridApiEndpoint);

        this._loggingService.log("producer-init", "Registering with Grid");

        const response = await registrationApiClient.registrationSet({
            registrationId: this._producerConfig.id,
            itemName: this._producerConfig.name,
            itemType: "producer"
        });
        this._loggingService.log("producer-init", `Registering with Grid: ${response.message}`);

        this._loggingService.log("producer-init", `Getting Channel Config from Grid`);
        const channelConfigResponse = await storageApiClient.storageGet({
            registrationId: this._producerConfig.id,
            context: "config",
            id: "channel"
        });

        if (channelConfigResponse && channelConfigResponse.item) {
            this._loggingService.log("producer-init", `Channel Config already exists`);
            this._producerChannelConfiguration = channelConfigResponse.item;
        } else {
            this._loggingService.log("producer-init", `Channel Config not found`);
            this._loggingService.log("producer-init", `Creating Channel`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            this._producerChannelConfiguration = {};
            await itemMamChannel.openWritable(this._producerChannelConfiguration);

            this._loggingService.log("producer-init", `Creating Channel Success`);

            this._loggingService.log("producer-init", `Storing Channel Config`);
            const storeResponse = await this.storeWritableChannelState();
            this._loggingService.log("producer-init", `Storing Channel Config: ${storeResponse.message}`);

            this._loggingService.log("producer-init", `Updating Registration`);
            const updateResponse = await registrationApiClient.registrationSet({
                registrationId: this._producerConfig.id,
                sideKey: this._producerChannelConfiguration.sideKey,
                root: this._producerChannelConfiguration.initialRoot
            });
            this._loggingService.log("producer-init", `Updating Registration: ${updateResponse.message}`);
        }
        this._loggingService.log("producer-init", `Registration Complete`);
    }

    /**
     * Reset the producer channel.
     */
    public async reset(): Promise<void> {
        if (this._producerChannelConfiguration) {
            this._loggingService.log("producer-reset", `Send Channel Reset`);

            const mamCommandChannel = new MamCommandChannel(this._nodeConfiguration);
            await mamCommandChannel.reset(this._producerChannelConfiguration);

            this._loggingService.log("producer-reset", `Storing Channel Config`);
            const storeResponse = await this.storeWritableChannelState();
            this._loggingService.log("producer-reset", `Storing Channel Config: ${storeResponse.message}`);

            this._loggingService.log("producer-reset", `Updating Registration with Grid`);
            const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);
            const updateResponse = await registrationApiClient.registrationSet({
                registrationId: this._producerConfig.id,
                sideKey: this._producerChannelConfiguration.sideKey,
                root: this._producerChannelConfiguration.initialRoot
            });
            this._loggingService.log("producer-reset", `Updating Registration with Grid: ${updateResponse.message}`);
        }
    }

    /**
     * Closedown the producer by unregistering from the Grid.
     */
    public async closedown(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);

        if (this._producerChannelConfiguration) {
            this._loggingService.log("producer-closedown", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            await itemMamChannel.closeWritable(this._producerChannelConfiguration);

            this._loggingService.log("producer-closedown", `Sending Goodbye Complete`);

            this._producerChannelConfiguration = undefined;
        }

        this._loggingService.log("producer-closedown", `Unregistering from the Grid`);

        const response = await registrationApiClient.registrationDelete({
            registrationId: this._producerConfig.id
        });

        this._loggingService.log("producer-closedown", `Unregistering from the Grid: ${response.message}`);
    }

    /**
     * Combine the information from the sources and generate an output command.
     */
    public async updateProducerOutput(): Promise<void> {
        if (this._producerChannelConfiguration) {
            const command: IProducerOutputCommand = {
                command: "output",
                startTime: Date.now() - 10000,
                endTime: Date.now(),
                askingPrice: 10000,
                // tslint:disable-next-line:insecure-random
                output: Math.random() * 1000,
                paymentAddress: "A".repeat(81)
            };

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);
            await itemMamChannel.sendCommand(this._producerChannelConfiguration, command);

            await this.storeWritableChannelState();
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
        // for (let i = 0; i < commands.length; i++) {
        //     this._loggingService.log("producer", "Processing", commands);
        // }
        this._loggingService.log(
            "producer",
            `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`
        );
    }

    /**
     * Store the state for the writable channel.
     */
    private async storeWritableChannelState(): Promise<IResponse> {
        const storageApiClient = new StorageApiClient(this._gridApiEndpoint);

        return storageApiClient.storageSet(
            {
                registrationId: this._producerConfig.id,
                context: "config",
                id: "channel"
            },
            this._producerChannelConfiguration);
    }
}
