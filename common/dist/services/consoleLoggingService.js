"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service to handle console logging.
 */
class ConsoleLoggingService {
    /**
     * Create a new instance of ConsoleLoggingService.
     * @param excludeContexts Contexts to exclude from logging.
     */
    constructor(excludeContexts) {
        this._excludeContexts = excludeContexts;
    }
    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    log(context, message, ...params) {
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
    break() {
        console.log();
    }
    /**
     * Log the error.
     * @param context The context for the log.
     * @param message The message to log.
     * @param err The error to log.
     * @param params The parameters to log.
     */
    error(context, message, err, ...params) {
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
    startCapture(contexts) {
        this._log = [];
        this._captureContexts = contexts;
    }
    /**
     * Stop capturing and return the captured logging.
     */
    stopCapture() {
        const log = this._log;
        this._log = undefined;
        return log;
    }
    /**
     * Format a capture into readable text.
     */
    formatCapture(capture) {
        const log = [];
        if (capture) {
            for (let i = 0; i < capture.length; i++) {
                if (capture[i].err) {
                    log.push(`[${capture[i].context}] Error::${capture[i].message}`);
                }
                else {
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
exports.ConsoleLoggingService = ConsoleLoggingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZUxvZ2dpbmdTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnNvbGVMb2dnaW5nU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ0gsTUFBYSxxQkFBcUI7SUFpQzlCOzs7T0FHRztJQUNILFlBQVksZUFBMEI7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFHLE1BQVc7UUFDdkQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25GLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztTQUNyRDtRQUNELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNYLE9BQU87Z0JBQ1AsT0FBTztnQkFDUCxNQUFNO2FBQ1QsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxLQUFLO1FBQ1IsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFVLEVBQUUsR0FBRyxNQUFXO1FBQ3JFLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuRixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxLQUFLLE9BQU8sU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsT0FBTztnQkFDUCxPQUFPO2dCQUNQLEdBQUc7Z0JBQ0gsTUFBTTthQUNULENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxRQUFrQjtRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksV0FBVztRQWtCZCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksYUFBYSxDQUFDLE9BaUJsQjtRQUNDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLElBQUksT0FBTyxFQUFFO1lBQ1QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtvQkFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7aUJBQ3BFO3FCQUFNO29CQUNILEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RDtnQkFDRCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7b0JBQ25CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMzQixDQUFDLENBQUMsQ0FBQztpQkFDTjthQUNKO1NBQ0o7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQW5LRCxzREFtS0MifQ==