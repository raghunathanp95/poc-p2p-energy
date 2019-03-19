import { ILoggingService, IMamChannelConfiguration, IMamCommand, INodeConfiguration, IResponse, MamCommandChannel, RegistrationApiClient, ServiceFactory, StorageApiClient } from "poc-p2p-energy-grid-common";
import { ISourceConfiguration } from "../models/ISourceConfiguration";
/**
 * Class to handle a source.
 */
export class SourceService {
    /**
     * Configuration for the source.
     */
    private readonly _sourceConfig: ISourceConfiguration;

    /**
     * Configuration for the producer api.
     */
    private readonly _producerApiEndpoint: string;

    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfiguration: INodeConfiguration;

    /**
     * Logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The channel configuration for the source.
     */
    private _sourceChannelConfiguration?: IMamChannelConfiguration;

    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the producer.
     * @param producerApiEndpoint The producer api endpoint.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(
        sourceConfig: ISourceConfiguration,
        producerApiEndpoint: string,
        nodeConfig: INodeConfiguration) {
        this._sourceConfig = sourceConfig;
        this._producerApiEndpoint = producerApiEndpoint;
        this._nodeConfiguration = nodeConfig;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    public async intialise(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._producerApiEndpoint);
        const storageApiClient = new StorageApiClient(this._producerApiEndpoint);

        this._loggingService.log("source", "Registering with Producer");

        const response = await registrationApiClient.registrationSet({
            registrationId: this._sourceConfig.id,
            itemName: this._sourceConfig.name,
            itemType: this._sourceConfig.type
        });
        this._loggingService.log("source", `Registering with Producer: ${response.message}`);

        this._loggingService.log("source", `Getting Channel Config from Producer`);
        const channelConfigResponse = await storageApiClient.storageGet({
            registrationId: this._sourceConfig.id,
            context: "config",
            id: "channel"
        });

        if (channelConfigResponse && channelConfigResponse.item) {
            this._loggingService.log("source", `Channel Config already exists`);
            this._sourceChannelConfiguration = channelConfigResponse.item;
        } else {
            this._loggingService.log("source", `Channel Config not found`);
            this._loggingService.log("source", `Creating Channel`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            this._sourceChannelConfiguration = {};
            await itemMamChannel.openWritable(this._sourceChannelConfiguration);

            this._loggingService.log("source", `Creating Channel Success`);

            this._loggingService.log("source", `Storing Channel Config`);
            const storeResponse = await this.storeWritableChannelState();
            this._loggingService.log("source", `Storing Channel Config: ${storeResponse.message}`);

            this._loggingService.log("source", `Updating Registration`);
            const updateResponse = await registrationApiClient.registrationSet({
                registrationId: this._sourceConfig.id,
                sideKey: this._sourceChannelConfiguration.sideKey,
                root: this._sourceChannelConfiguration.initialRoot
            });
            this._loggingService.log("source", `Updating Registration: ${updateResponse.message}`);
        }
        this._loggingService.log("source", `Registration Complete`);
    }

    /**
     * Unregister the source from the Producer.
     * @param configuration The configuration to use.
     * @param mamChannelConfig The mam channel to close.
     */
    public async closedown(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._producerApiEndpoint);

        if (this._sourceChannelConfiguration) {
            this._loggingService.log("source", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            await itemMamChannel.closeWritable(this._sourceChannelConfiguration);

            this._loggingService.log("source", `Sending Goodbye Complete`);

            this._sourceChannelConfiguration = undefined;
        }

        this._loggingService.log("source", `Unregistering from the Producer`);

        const response = await registrationApiClient.registrationDelete({
            registrationId: this._sourceConfig.id
        });

        this._loggingService.log("source", `Unregistering from the Producer: ${response.message}`);
    }

    /**
     * Store the state for the writable channel.
     */
    public async storeWritableChannelState(): Promise<IResponse> {
        const storageApiClient = new StorageApiClient(this._producerApiEndpoint);

        return storageApiClient.storageSet(
            {
                registrationId: this._sourceConfig.id,
                context: "config",
                id: "channel"
            },
            this._sourceChannelConfiguration);
    }

    /**
     * Send a command to the channel.
     */
    public async sendCommand<T extends IMamCommand>(command: T): Promise<void> {
        const mamCommandChannel = new MamCommandChannel(this._nodeConfiguration);
        await mamCommandChannel.sendCommand(this._sourceChannelConfiguration, command);
        await this.storeWritableChannelState();
    }
}
