import { ServiceFactory } from "../factories/serviceFactory";
import { IConsumerConfiguration } from "../models/config/consumer/IConsumerConfiguration";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { ILoggingService } from "../models/services/ILoggingService";
import { IRegistrationService } from "../models/services/IRegistrationService";
import { IStorageService } from "../models/services/IStorageService";
import { IConsumerManagerState } from "../models/state/IConsumerManagerState";
import { MamCommandChannel } from "./mamCommandChannel";

/**
 * Class to handle a consumer.
 */
export class ConsumerManager {
    /**
     * Configuration for the consumer.
     */
    private readonly _config: IConsumerConfiguration;

    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfig: INodeConfiguration;

    /**
     * Logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Registration service.
     */
    private readonly _registrationService: IRegistrationService;

    /**
     * The current state for the consumer.
     */
    private _state?: IConsumerManagerState;

    /**
     * Create a new instance of ConsumerService.
     * @param consumerConfig The configuration for the consumer.
     * @param nodeConfig The configuration for a tangle node.
     * @param registrationService The service used to store registrations.
     * @param loggingService To send log output.
     */
    constructor(
        consumerConfig: IConsumerConfiguration,
        nodeConfig: INodeConfiguration) {
        this._config = consumerConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
        this._registrationService = ServiceFactory.get<IRegistrationService>("consumer-registration");
    }

    /**
     * Register the consumer with the Grid.
     * @param configuration The configuration to use.
     */
    public async intialise(): Promise<void> {
        await this.loadState();

        this._loggingService.log("consumer-init", "Registering with Grid");

        const response = await this._registrationService.register(
            this._config.id,
            this._config.name,
            "consumer",
            this._state && this._state.channel && this._state.channel.sideKey,
            this._state && this._state.channel && this._state.channel.initialRoot
        );

        this._loggingService.log("consumer-init", `Registered with Grid`);

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
            await this._registrationService.register(
                this._config.id,
                this._config.name,
                "consumer",
                this._state.channel.sideKey,
                this._state.channel.initialRoot
            );
            this._loggingService.log("consumer-init", `Updated Registration`);
        }
        this._loggingService.log("consumer-init", `Registration Complete`);

        await this.saveState();
    }

    /**
     * Unregister the source from the Grid.
     */
    public async closedown(): Promise<void> {
        if (this._state && this._state.channel) {
            this._loggingService.log("consumer-closedown", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfig);

            await itemMamChannel.closeWritable(this._state.channel);

            this._loggingService.log("consumer-closedown", `Sending Goodbye Complete`);

            this._state.channel = undefined;
        }

        this._loggingService.log("consumer-closedown", `Unregistering from the Grid`);

        await this._registrationService.unregister(this._config.id);

        this._loggingService.log("consumer-closedown", `Unregistered from the Grid`);
    }

    /**
     * Load the state for the consumer.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IConsumerManagerState>>(
            "consumer-storage-manager-state");

        this._loggingService.log("consumer", `Loading State`);
        this._state = await storageConfigService.get("state");
        this._loggingService.log("consumer", `Loaded State`);

        this._state = this._state || {};
    }

    /**
     * Store the state for the consumer.
     */
    private async saveState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<IConsumerManagerState>>(
            "consumer-storage-manager-state");

        this._loggingService.log("consumer", `Storing State`);
        await storageConfigService.set("state", this._state);
        this._loggingService.log("consumer", `Storing State Complete`);
    }
}
