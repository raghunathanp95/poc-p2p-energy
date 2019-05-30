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
        console.log(`[${context}] ${message}`, ...params);
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
        console.error(`[${context}] ${message}::Error`, err, ...params);
    }
}
exports.ConsoleLoggingService = ConsoleLoggingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZUxvZ2dpbmdTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2xvZ2dpbmcvY29uc29sZUxvZ2dpbmdTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQUM5Qjs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBZSxFQUFFLEdBQUcsTUFBVztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksS0FBSztRQUNSLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLE9BQWUsRUFBRSxPQUFlLEVBQUUsR0FBVSxFQUFFLEdBQUcsTUFBVztRQUNyRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxLQUFLLE9BQU8sU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Q0FDSjtBQTVCRCxzREE0QkMifQ==