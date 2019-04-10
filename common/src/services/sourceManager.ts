import { ServiceFactory } from "../factories/serviceFactory";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { ISourceConfiguration } from "../models/config/source/ISourceConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { ISourceOutputCommand } from "../models/mam/ISourceOutputCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { IRegistrationService } from "../models/services/IRegistrationService";
import { IStorageService } from "../models/services/IStorageService";
import { ISourceManagerState } from "../models/state/ISourceManagerState";
import { MamCommandChannel } from "./mamCommandChannel";
/**
 * Class to handle a source.
 */
export class SourceManager {
    /**
     * Configuration for the source.
     */
    private readonly _config: ISourceConfiguration;

    /**
     * Registration service.
     */
    private readonly _registrationService: IRegistrationService;

    /**
     * Configuration for the tangle node.
     */
    private readonly _nodeConfig: INodeConfiguration;

    /**
     * Logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The current state for the source.
     */
    private _state?: ISourceManagerState;

    /**
     * Create a new instance of SourceService.
     * @param sourceConfig The configuration for the source.
     * @param nodeConfig The configuration for a tangle node.
     */
    constructor(
        sourceConfig: ISourceConfiguration,
        nodeConfig: INodeConfiguration) {
        this._config = sourceConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
        this._registrationService = ServiceFactory.get<IRegistrationService>("source-registration");
    }

    /**
     * Register the source with the Producer.
     * @param configuration The configuration to use.
     */
    public async intialise(): Promise<void> {
        await this.loadState();

        this._loggingService.log("source-init", "Registering with Producer");

        await this._registrationService.register(
            this._config.id,
            this._config.name,
            this._config.type,
            this._state && this._state.channel && this._state.channel.sideKey,
            this._state && this._state.channel && this._state.channel.initialRoot
        );
        this._loggingService.log("source-init", `Registered with Producer`);

        if (this._state.channel) {
            this._loggingService.log("source-init", `Channel Config already exists`);
        } else {
            this._loggingService.log("source-init", `Channel Config not found`);
            this._loggingService.log("source-init", `Creating Channel`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfig);

            this._state.channel = {};
            await itemMamChannel.openWritable(this._state.channel);

            this._loggingService.log("source-init", `Creating Channel Success`);

            this._loggingService.log("source-init", `Updating Registration`);
            await this._registrationService.register(
                this._config.id,
                this._config.name,
                this._config.type,
                this._state.channel.sideKey,
                this._state.channel.initialRoot
            );
            this._loggingService.log("source-init", `Updated Registration`);
        }
        this._loggingService.log("source-init", `Registration Complete`);

        await this.saveState();
    }

    /**
     * Unregister the source from the Producer.
     */
    public async closedown(): Promise<void> {
        if (this._state && this._state.channel) {
            this._loggingService.log("source", `Sending Goodbye`);

            const itemMamChannel = new MamCommandChannel(this._nodeConfig);

            await itemMamChannel.closeWritable(this._state.channel);

            this._loggingService.log("source", `Sending Goodbye Complete`);

            this._state.channel = undefined;
        }

        this._loggingService.log("source", `Unregistering from the Producer`);

        await this._registrationService.unregister(this._config.id);

        this._loggingService.log("source", `Unregistered from the Producer`);
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
        const mamCommandChannel = new MamCommandChannel(this._nodeConfig);
        await mamCommandChannel.sendCommand(this._state.channel, command);
        await this.saveState();
    }

    /**
     * Load the state for the producer.
     */
    private async loadState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<ISourceManagerState>>(
            "source-storage-manager-state");

        this._loggingService.log("source", `Loading State`);
        this._state = await storageConfigService.get("state");
        this._loggingService.log("source", `Loaded State`);

        this._state = this._state || {
            lastOutputTime: Date.now()
        };
    }

    /**
     * Store the state for the source.
     */
    private async saveState(): Promise<void> {
        const storageConfigService = ServiceFactory.get<IStorageService<ISourceManagerState>>(
            "source-storage-manager-state");

        this._loggingService.log("source", `Storing State`);
        await storageConfigService.set("state", this._state);
        this._loggingService.log("source", `Storing State Complete`);
    }
}