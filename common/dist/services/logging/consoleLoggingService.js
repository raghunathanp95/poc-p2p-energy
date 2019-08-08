"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service to handle console logging.
 */
class ConsoleLoggingService {
    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    log(context, message, ...params) {
        // tslint:disable-next-line:no-console
        console.log(`[${context}] ${message}`, ...params);
    }
    /**
     * Log a break.
     */
    break() {
        // tslint:disable-next-line:no-console
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
        console.error(`[${context}] ${message}::Error`, err, ...params);
    }
}
exports.ConsoleLoggingService = ConsoleLoggingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZUxvZ2dpbmdTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2xvZ2dpbmcvY29uc29sZUxvZ2dpbmdTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQUM5Qjs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBZSxFQUFFLEdBQUcsTUFBVztRQUN2RCxzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDUixzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFVLEVBQUUsR0FBRyxNQUFXO1FBQ3JFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLEtBQUssT0FBTyxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNKO0FBOUJELHNEQThCQyJ9