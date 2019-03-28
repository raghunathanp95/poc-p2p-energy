import { ILoggingService } from "../models/services/ILoggingService";
/**
 * Service to handle console logging.
 */
export declare class ConsoleLoggingService implements ILoggingService {
    /**
     * The capture log.
     */
    private _log?;
    /**
     * The contexts to exclude.
     */
    private readonly _excludeContexts?;
    /**
     * The contexts to capture.
     */
    private _captureContexts?;
    /**
     * Create a new instance of ConsoleLoggingService.
     * @param excludeContexts Contexts to exclude from logging.
     */
    constructor(excludeContexts?: string[]);
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
     * Start capturing.
     * @param contexts The contexts to capture.
     */
    startCapture(contexts: string[]): void;
    /**
     * Stop capturing and return the captured logging.
     */
    stopCapture(): {
        /**
         * The context that was logged.
         */
        context: string;
        /**
         * The message that was logged.
         */
        message: string;
        /**
         * The error that was logged.
         */
        err?: Error;
        /**
         * The params that were logged.
         */
        params: any[];
    }[];
    /**
     * Format a capture into readable text.
     */
    formatCapture(capture: {
        /**
         * The context that was logged.
         */
        context: string;
        /**
         * The message that was logged.
         */
        message: string;
        /**
         * The error that was logged.
         */
        err?: Error;
        /**
         * The params that were logged.
         */
        params: any[];
    }[]): string[];
}
