import Mam from "mam.client.js";
import { ServiceFactory } from "../factories/serviceFactory";
import { INodeConfiguration } from "../models/config/INodeConfiguration";
import { IMamChannelConfiguration } from "../models/mam/IMamChannelConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
import { ILoggingService } from "../models/services/ILoggingService";
import { TrytesHelper } from "../utils/trytesHelper";

/**
 * Class for encapsulating mam methods.
 */
export class MamCommandChannel {
    /**
     * Node configuration for tangle operations.
     */
    private readonly _config: INodeConfiguration;

    /**
     * Logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Create a new instance of MamChannel.
     * @param config The configuration to use.
     */
    constructor(config: INodeConfiguration) {
        this._config = config;
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Create a new writable mam channel.
     * @param channelConfiguration The configuration to be populated for the channel.
     * @param config The configuration for node connectivity.
     * @returns The seed, key, initial root and next root if a payload was provided.
     */
    public async openWritable(channelConfiguration: IMamChannelConfiguration): Promise<IMamChannelConfiguration> {
        channelConfiguration.seed = TrytesHelper.generateHash(81);
        channelConfiguration.sideKey = TrytesHelper.generateHash(81);
        channelConfiguration.start = 0;
        channelConfiguration.initialRoot = undefined;
        channelConfiguration.nextRoot = undefined;
        channelConfiguration.mostRecentRoot = undefined;

        this._loggingService.log(
            "mam",
            "Opening Writable Channel",
            {
                seed: channelConfiguration.seed,
                sideKey: channelConfiguration.sideKey
            });

        const helloCommand: IMamCommand = {
            command: "hello"
        };

        await this.sendCommand(channelConfiguration, helloCommand);

        this._loggingService.log(
            "mam",
            "Opening Writable Channel",
            {
                initialRoot: channelConfiguration.initialRoot
            });

        return channelConfiguration;
    }

    /**
     * Initialise a readable mam channel by reading it to most recent payload.
     * @param channelConfiguration The current configuration for the channel.
     * @returns True if we could read the hello command from the channel.
     */
    public async openReadable(channelConfiguration: IMamChannelConfiguration): Promise<boolean> {
        this._loggingService.log("mam", "Opening Readable Channel", channelConfiguration.initialRoot);

        const commands = await this.receiveCommands(channelConfiguration, "hello");

        return commands && commands.length > 0 && commands[0].command === "hello";
    }

    /**
     * Close a writable a mam channel.
     * @param channelConfiguration The current configuration for the channel.
     */
    public async closeWritable(channelConfiguration: IMamChannelConfiguration): Promise<void> {
        this._loggingService.log("mam", "Closing Writable Channel");

        const goodbyeCommand: IMamCommand = {
            command: "goodbye"
        };

        await this.sendCommand(channelConfiguration, goodbyeCommand);
    }

    /**
     * Send a command to the mam channel.
     * @param channelConfiguration The current configuration for the channel.
     * @param command The payload to send.
     */
    public async sendCommand(channelConfiguration: IMamChannelConfiguration, command: IMamCommand): Promise<void> {
        this._loggingService.log("mam", "Send Command", command);

        let mamState = Mam.init(this._config.provider, channelConfiguration.seed);
        mamState = Mam.changeMode(mamState, "restricted", channelConfiguration.sideKey);

        if (!channelConfiguration.initialRoot) {
            channelConfiguration.initialRoot = Mam.getRoot(mamState);
        }

        channelConfiguration.mostRecentRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;

        mamState.channel.next_root = channelConfiguration.nextRoot;
        mamState.channel.start = channelConfiguration.start;

        const message = Mam.create(mamState, TrytesHelper.toTrytes(command));
        await Mam.attach(message.payload, message.address, this._config.depth, this._config.mwm);

        channelConfiguration.nextRoot = mamState.channel.next_root;
        channelConfiguration.start = mamState.channel.start;
    }

    /**
     * Receive commands from the mam channel.
     * @param channelConfiguration The configuration for the channel.
     * @param terminateCommand Stop reading the command if you see the specific command.
     * @returns A list of the new commands.
     */
    public async receiveCommands(
        channelConfiguration: IMamChannelConfiguration,
        terminateCommand?: string): Promise<IMamCommand[]> {
        const commands = [];

        if (channelConfiguration) {
            let nextRoot = channelConfiguration.nextRoot || channelConfiguration.initialRoot;
            if (nextRoot) {
                Mam.init(this._config.provider);

                let fetchResponse;

                do {
                    channelConfiguration.mostRecentRoot = nextRoot;

                    console.log(channelConfiguration);
                    fetchResponse = await Mam.fetchSingle(nextRoot, "restricted", channelConfiguration.sideKey);

                    if (fetchResponse) {
                        nextRoot = fetchResponse.nextRoot;

                        if (fetchResponse.payload) {
                            const command = TrytesHelper.fromTrytes<IMamCommand>(fetchResponse.payload);

                            this._loggingService.log("mam", "Received Command", command);

                            this.defaultHandleCommand(channelConfiguration, command);
                            commands.push(command);

                            if (terminateCommand && command.command === terminateCommand) {
                                fetchResponse = undefined;
                            }
                        }
                    }
                } while (fetchResponse && fetchResponse.payload && channelConfiguration.sideKey);

                if (channelConfiguration.sideKey) {
                    channelConfiguration.nextRoot = nextRoot;
                }
            }
        }

        return commands;
    }

    /**
     * Perform a reset on the channel.
     * @param channelConfiguration The configuration for the channel.
     */
    public async reset(channelConfiguration: IMamChannelConfiguration): Promise<void> {
        // Send a goodbye to the channel
        // which will make the recipient wait for new details
        // before continuing communications
        const resetCommand: IMamCommand = {
            command: "goodbye"
        };
        await this.sendCommand(channelConfiguration, resetCommand);

        // Open a new channel and send the hello message
        await this.openWritable(channelConfiguration);
    }

    /**
     * Handle and commands we can process internally.
     * @param channelConfiguration The channel configuration.
     * @param command The command.
     */
    private defaultHandleCommand(channelConfiguration: IMamChannelConfiguration, command: IMamCommand): void {

        if (command.command === "hello") {
            // nothing else in this payload
            // we would normally see this during the open of the channel
            this._loggingService.log("registration", `handling '${command.command}'`);
        } else if (command.command === "goodbye") {
            // nothing else in this payload, although we should stop reading when we see this
            // so reset all the channel details, so an external user will know to reset the channel as well
            this._loggingService.log("registration", `handling '${command.command}'`);
            channelConfiguration.initialRoot = undefined;
            channelConfiguration.mostRecentRoot = undefined;
            channelConfiguration.nextRoot = undefined;
            channelConfiguration.sideKey = undefined;
            channelConfiguration.start = undefined;
        }
    }
}
