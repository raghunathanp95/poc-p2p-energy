import { ILoggingService } from "../models/services/ILoggingService";

/**
 * Service to handle console logging.
 */
export class ConsoleLoggingService implements ILoggingService {
    /**
     * The capture log.
     */
    private _log?: {
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
     * The contexts to exclude.
     */
    private readonly _excludeContexts?: string[];

    /**
     * The contexts to capture.
     */
    private _captureContexts?: string[];

    /**
     * Create a new instance of ConsoleLoggingService.
     * @param excludeContexts Contexts to exclude from logging.
     */
    constructor(excludeContexts?: string[]) {
        this._excludeContexts = excludeContexts;
    }

    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    public log(context: string, message: string, ...params: any): void {
        if (this._excludeContexts === undefined || this._excludeContexts.indexOf(context) < 0) {
            console.log(`[${context}] ${message}`, ...params);
        }
        if (this._log !== undefined && this._captureContexts && this._captureContexts.indexOf(context) >= 0) {
            this._log.push({
                context,
                message,
                params
            });
        }
    }

    /**
     * Log a break.
     */
    public break(): void {
        console.log();
    }

    /**
     * Log the error.
     * @param context The context for the log.
     * @param message The message to log.
     * @param err The error to log.
     * @param params The parameters to log.
     */
    public error(context: string, message: string, err: Error, ...params: any): void {
        if (this._excludeContexts === undefined || this._excludeContexts.indexOf(context) < 0) {
            console.error(`[${context}] ${message}::Error`, err, ...params);
        }
        if (this._log !== undefined && this._captureContexts && this._captureContexts.indexOf(context) >= 0) {
            this._log.push({
                context,
                message,
                err,
                params
            });
        }
    }

    /**
     * Start capturing.
     * @param contexts The contexts to capture.
     */
    public startCapture(contexts: string[]): void {
        this._log = [];
        this._captureContexts = contexts;
    }

    /**
     * Stop capturing and return the captured logging.
     */
    public stopCapture(): {
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
    }[] {
        const log = this._log;
        this._log = undefined;
        return log;
    }

    /**
     * Format a capture into readable text.
     */
    public formatCapture(capture: {
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
    }[]): string[] {
        const log = [];

        if (capture) {
            for (let i = 0; i < capture.length; i++) {
                if (capture[i].err) {
                    log.push(`[${capture[i].context}] Error::${capture[i].message}`);
                } else {
                    log.push(`[${capture[i].context}] ${capture[i].message}`);
                }
                if (capture[i].params) {
                    capture[i].params.map(p => {
                        log.push(p.toString());
                    });
                }
            }
        }

        return log;
    }
}
