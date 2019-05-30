import { ILoggingEntry } from "../../models/services/ILoggingEntry";
import { ILoggingService } from "../../models/services/ILoggingService";
/**
 * Service to handle console logging.
 */
export declare class CallbackLoggingService implements ILoggingService {
    /**
     * The callback to send to.
     */
    private readonly _callbacks;
    /**
     * Create a new instance of CallbackLoggingService.
     */
    constructor();
    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    log(context: string, message: string, ...params: any): void;
    /**
     * Log a break.
     */
    break(): void;
    /**
     * Log the error.
     * @param context The context for the log.
     * @param message The message to log.
     * @param err The error to log.
     * @param params The parameters to log.
     */
    error(context: string, message: string, err: Error, ...params: any): void;
    /**
     * Add a new callback.
     * @param id The id of the callback.
     * @param callback The callback to call.
     */
    addCallback(id: string, callback: (log: ILoggingEntry) => void): void;
    /**
     * Remove a callback by id.
     * @param id The id of the callback.
     */
    removeCallback(id: string): void;
    /**
     * Send a log entry to the callbacks.
     * @param context The context for the log.
     * @param message The message.
     * @param err The error.
     * @param params The parameters.
     */
    private sendLog;
}
