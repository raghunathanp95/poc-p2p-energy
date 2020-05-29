"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service to handle console logging.
 */
class CallbackLoggingService {
    /**
     * Create a new instance of CallbackLoggingService.
     */
    constructor() {
        this._callbacks = {};
    }
    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    log(context, message, ...params) {
        this.sendLog(context, message, undefined, ...params);
    }
    /**
     * Log a break.
     */
    break() {
        this.sendLog("", "", undefined, undefined);
    }
    /**
     * Log the error.
     * @param context The context for the log.
     * @param message The message to log.
     * @param err The error to log.
     * @param params The parameters to log.
     */
    error(context, message, err, ...params) {
        this.sendLog(context, message, err, ...params);
    }
    /**
     * Add a new callback.
     * @param id The id of the callback.
     * @param callback The callback to call.
     */
    addCallback(id, callback) {
        this._callbacks[id] = callback;
    }
    /**
     * Remove a callback by id.
     * @param id The id of the callback.
     */
    removeCallback(id) {
        delete this._callbacks[id];
    }
    /**
     * Send a log entry to the callbacks.
     * @param context The context for the log.
     * @param message The message.
     * @param err The error.
     * @param params The parameters.
     */
    sendLog(context, message, err, ...params) {
        for (const id in this._callbacks) {
            this._callbacks[id]({ context, message, err, params });
        }
    }
}
exports.CallbackLoggingService = CallbackLoggingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbGJhY2tMb2dnaW5nU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9sb2dnaW5nL2NhbGxiYWNrTG9nZ2luZ1NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQTs7R0FFRztBQUNILE1BQWEsc0JBQXNCO0lBUS9COztPQUVHO0lBQ0g7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFHLE1BQVc7UUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDUixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFVLEVBQUUsR0FBRyxNQUFXO1FBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxFQUFVLEVBQUUsUUFBc0M7UUFDakUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxFQUFVO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssT0FBTyxDQUFDLE9BQWUsRUFBRSxPQUFlLEVBQUUsR0FBVSxFQUFFLEdBQUcsTUFBVztRQUN4RSxLQUFLLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7U0FDekQ7SUFDTCxDQUFDO0NBQ0o7QUF4RUQsd0RBd0VDIn0=