import { ILoggingEntry } from "../../models/services/ILoggingEntry";
import { ILoggingService } from "../../models/services/ILoggingService";
/**
 * Service to handle console logging.
 */
export declare class CaptureLoggingService implements ILoggingService {
    /**
     * The capture log.
     */
    private _log?;
    /**
     * Contexts to capture.
     */
    private _contexts;
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
     * Enable the logging for the given contexts.
     * @param contexts The context to monitor.
     */
    enable(contexts?: string[]): void;
    /**
     * Disable the logging.
     */
    disable(): void;
    /**
     * Get the logged items filter by context.
     * @returns The captured log entries.
     */
    getCapture(): ILoggingEntry[];
    /**
     * Format a capture into readable text.
     * @param capture A list of logging entries to format.
     * @returns The formatted entries.
     */
    formatCapture(capture: ILoggingEntry[]): string[];
}
