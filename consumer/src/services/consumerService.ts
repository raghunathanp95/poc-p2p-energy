import { ILoggingService, INodeConfiguration, IStorageService, MamCommandChannel, RegistrationApiClient, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IConsumerConfiguration } from "../models/IConsumerConfiguration";
import { IConsumerState } from "../models/IConsumerState";
/**
 * Class to handle a consumer.
 */
export class ConsumerService {
    /**
     * Configuration for the consumer.
     */
    private readonly _config: IConsumerConfiguration;

    /**
     * Configuration for the grid api.
     */
    private readonly _gridApiEndpoint: string;

    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfig: INodeConfiguration;

    /**
     * Logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The current state for the consumer.
     */
    private _state?: IConsumerState;

    /**
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param gridApiEndpoint The grid api endpoint.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(
        consumerConfig: IConsumerConfiguration,
        gridApiEndpoint: string,
        nodeConfig: INodeConfiguration) {
        this._config = consumerConfig;
        this._gridApiEndpoint = gridApiEndpoint;
        this._nodeConfig = nodeConfig;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    public async intialise(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);

        await this.loadState();

        this._loggingService.log("consumer-init", "Registering with Grid");

        const response = await registrationApiClient.registrationSet({
            registrationId: this._config.id,
            itemName: this._config.name,
            itemType: "consumer",
            sideKey: this._state && this._state.channel && this._state.channel.sideKey,
            root: this._state && this._state.channel && this._state.channel.initialRoot
        });

        this._loggingService.log("consumer-init", `Registering with Grid: ${response.message}`);

        this._loggingService.log("consumer-init", `Grid returned mam channel: ${response.root}, ${response.sideKey}`);

        if (!this._state.returnChannel && response.root && response.sideKey) {
            this._loggingService.log("consumer-init", `Opening return channel`);
            this._state.returnChannel = {
                initialRoot: response.root,
                sideKey: response.sideKey
            };

            const returnMamChannel = new MamCommandChannel(this._nodeConfig);
            if (await returnMamChannel.openReadable(this._state.returnChannel)) {
                this._loggingService.log("consumer-init", `Opening return channel success`);
            } else {
                this._loggingService.log("consumer-init", `Opening return channel failed`);
            }
        }

        if (this._state.channel) {
            this._loggingService.log("consumer-init", `Channel Config already exists`);
        } else {
            this._loggingService.log("consumer-init", `Channel Config not found`);
            this._loggingService.log("consumer-init", `Creating Channel`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfig);

            this._state.channel = {};
            await itemMamChannel.openWritable(this._state.channel);

            this._loggingService.log("consumer-init", `Creating Channel Success`);

            this._loggingService.log("consumer-init", `Updating Registration`);
            const updateResponse = await registrationApiClient.registrationSet({
                registrationId: this._config.id,
                sideKey: this._state.channel.sideKey,
                root: this._state.channel.initialRoot
            });
            this._loggingService.log("consumer-init", `Updating Registration: ${ updateResponse.message } `);
        }
        this._loggingService.log("consumer-init", `Registration Complete`);

        await this.saveState();
    }

    /**
     * Unregister the source from the Grid.
     */
    public async closedown(): Promise<void> {
        const registrationApiClient = new RegistrationApiClient(this._gridApiEndpoint);

        if (this._state && this._state.channel) {
            this._loggingService.log("consumer-closedown", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfig);

            await itemMamChannel.closeWritable(this._state.channel);

            this._loggingService.log("consumer-closedown", `Sending Goodbye Complete`);

            this._state.channel = undefined;
        }

        this._loggingService.log("consumer-closedown", `Unregistering from the Grid`);

        const response = await registrationApiClient.registrationDelete({
            registrationId: this._config.id
        });

        this._loggingService.log("consumer-closedown", `Unregistering from the Grid: ${ response.message } `);
    }

    /**
     * Load the state for the consumer.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IConsumerState>>("storage-config");

        this._loggingService.log("consumer", `Loading State`);
        this._state = await storageConfigService.get("state");
        this._loggingService.log("consumer", `Loaded State`);

        this._state = this._state || {};
    }

    /**
     * Store the state for the consumer.
     */
    private async saveState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IConsumerState>>("storage-config");

        this._loggingService.log("consumer", `Storing State`);
        await storageConfigService.set("state", this._state);
        this._loggingService.log("consumer", `Storing State Complete`);
    }
}
