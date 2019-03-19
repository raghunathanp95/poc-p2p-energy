import { ILoggingService, IMamCommand, INodeConfiguration, ISourceOutputCommand, IStorageService, MamCommandChannel, RegistrationApiClient, ServiceFactory } from "poc-p2p-energy-grid-common";
import { ISourceConfiguration } from "../models/ISourceConfiguration";
import { ISourceState } from "../models/ISourceState";
/**
 * Class to handle a source.
 */
export class SourceService {
    /**
     * Configuration for the source.
     */
    private readonly _config: ISourceConfiguration;

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
     * The current state for the source.
     */
    private _state?: ISourceState;

    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the source.
     * @param producerApiEndpoint The producer api endpoint.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(
        sourceConfig: ISourceConfiguration,
        producerApiEndpoint: string,
        nodeConfig: INodeConfiguration) {
        this._config = sourceConfig;
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

        this._loggingService.log("source-init", "Registering with Producer");

        const response = await registrationApiClient.registrationSet({
            registrationId: this._config.id,
            itemName: this._config.name,
            itemType: this._config.type
        });
        this._loggingService.log("source-init", `Registering with Producer: ${response.message}`);

        await this.loadState();

        if (this._state.channel) {
            this._loggingService.log("source-init", `Channel Config already exists`);
        } else {
            this._loggingService.log("source-init", `Channel Config not found`);
            this._loggingService.log("source-init", `Creating Channel`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            this._state.channel = {};
            await itemMamChannel.openWritable(this._state.channel);

            this._loggingService.log("source-init", `Creating Channel Success`);

            await this.storeState();

            this._loggingService.log("source-init", `Updating Registration`);
            const updateResponse = await registrationApiClient.registrationSet({
                registrationId: this._config.id,
                sideKey: this._state.channel.sideKey,
                root: this._state.channel.initialRoot
            });
            this._loggingService.log("source-init", `Updating Registration: ${updateResponse.message}`);
        }
        this._loggingService.log("source-init", `Registration Complete`);
    }

    /**
     * Unregister the source from the Producer.
     * @param configuration The configuration to use.
     * @param mamChannelConfig The mam channel to close.
     */
    public async closedown(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._producerApiEndpoint);

        if (this._state && this._state.channel) {
            this._loggingService.log("source", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfiguration);

            await itemMamChannel.closeWritable(this._state.channel);

            this._loggingService.log("source", `Sending Goodbye Complete`);

            this._state.channel = undefined;
        }

        this._loggingService.log("source", `Unregistering from the Producer`);

        const response = await registrationApiClient.registrationDelete({
            registrationId: this._config.id
        });

        this._loggingService.log("source", `Unregistering from the Producer: ${response.message}`);
    }

    /**
     * Send an output command to the mam channel.
     * @param value The output to send.
     */
    public async sendOutputCommand(value: number): Promise<void> {
        const command: ISourceOutputCommand = {
            command: "output",
            startTime: this._state.lastOutputTime + 1,
            endTime: Date.now(),
            output: value
        };

        this._state.lastOutputTime = command.endTime;

        return this.sendCommand(command);
    }

    /**
     * Send a command to the channel.
     */
    public async sendCommand<T extends IMamCommand>(command: T): Promise<void> {
        const mamCommandChannel = new MamCommandChannel(this._nodeConfiguration);
        await mamCommandChannel.sendCommand(this._state.channel, command);
        await this.storeState();
    }

    /**
     * Load the state for the producer.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<ISourceState>>("storage-config");

        this._loggingService.log("source-init", `Loading State`);
        this._state = await storageConfigService.get("state");
        this._loggingService.log("source-init", `Loaded State`);

        this._state = this._state || {
            lastOutputTime: Date.now()
        };
    }

    /**
     * Store the state for the source.
     */
    private async storeState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<ISourceState>>("storage-config");

        this._loggingService.log("source", `Storing State`);
        await storageConfigService.set("state", this._state);
        this._loggingService.log("source", `Storing State Complete`);
    }
}
