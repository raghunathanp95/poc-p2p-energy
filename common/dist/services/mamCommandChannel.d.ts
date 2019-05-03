import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { IMamChannelConfiguration } from "../models/mam/IMamChannelConfiguration";
import { IMamCommand } from "../models/mam/IMamCommand";
/**
 * Class for encapsulating mam methods.
 */
export declare class MamCommandChannel {
    /**
     * The load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
    /**
     * Logging service.
     */
    private readonly _loggingService;
    /**
     * Create a new instance of MamChannel.
     * @param nodeWalkStrategy The load balancer settings for communications.
     */
    constructor(loadBalancerSettings: LoadBalancerSettings);
    /**
     * Create a new writable mam channel.
     * @param channelConfiguration The configuration to be populated for the channel.
     * @param config The configuration for node connectivity.
     * @returns The seed, key, initial root and next root if a payload was provided.
     */
    openWritable(channelConfiguration: IMamChannelConfiguration): Promise<IMamChannelConfiguration>;
    /**
     * Initialise a readable mam channel by reading it to most recent payload.
     * @param channelConfiguration The current configuration for the channel.
     * @returns True if we could read the hello command from the channel.
     */
    openReadable(channelConfiguration: IMamChannelConfiguration): Promise<boolean>;
    /**
     * Close a writable a mam channel.
     * @param channelConfiguration The current configuration for the channel.
     */
    closeWritable(channelConfiguration: IMamChannelConfiguration): Promise<void>;
    /**
     * Send a command to the mam channel.
     * @param channelConfiguration The current configuration for the channel.
     * @param command The payload to send.
     */
    sendCommand(channelConfiguration: IMamChannelConfiguration, command: IMamCommand): Promise<void>;
    /**
     * Receive commands from the mam channel.
     * @param channelConfiguration The configuration for the channel.
     * @param terminateCommand Stop reading the command if you see the specific command.
     * @returns A list of the new commands.
     */
    receiveCommands(channelConfiguration: IMamChannelConfiguration, terminateCommand?: string): Promise<IMamCommand[]>;
    /**
     * Perform a reset on the channel.
     * @param channelConfiguration The configuration for the channel.
     */
    reset(channelConfiguration: IMamChannelConfiguration): Promise<void>;
    /**
     * Handle and commands we can process internally.
     * @param channelConfiguration The channel configuration.
     * @param command The command.
     */
    private defaultHandleCommand;
}
