"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service to handle console logging.
 */
var ConsoleLoggingService = /** @class */ (function () {
    /**
     * Create a new instance of ConsoleLoggingService.
     * @param excludeContexts Contexts to exclude from logging.
     */
    function ConsoleLoggingService(excludeContexts) {
        this._excludeContexts = excludeContexts;
    }
    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    ConsoleLoggingService.prototype.log = function (context, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this._excludeContexts === undefined || this._excludeContexts.indexOf(context) < 0) {
            console.log.apply(console, ["[" + context + "] " + message].concat(params));
        }
        if (this._log !== undefined && this._captureContexts && this._captureContexts.indexOf(context) >= 0) {
            this._log.push({
                context: context,
                message: message,
                params: params
            });
        }
    };
    /**
     * Log a break.
     */
    ConsoleLoggingService.prototype.break = function () {
        console.log();
    };
    /**
     * Log the error.
     * @param context The context for the log.
     * @param message The message to log.
     * @param err The error to log.
     * @param params The parameters to log.
     */
    ConsoleLoggingService.prototype.error = function (context, message, err) {
        var params = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            params[_i - 3] = arguments[_i];
        }
        if (this._excludeContexts === undefined || this._excludeContexts.indexOf(context) < 0) {
            console.error.apply(console, ["[" + context + "] " + message + "::Error", err].concat(params));
        }
        if (this._log !== undefined && this._captureContexts && this._captureContexts.indexOf(context) >= 0) {
            this._log.push({
                context: context,
                message: message,
                err: err,
                params: params
            });
        }
    };
    /**
     * Start capturing.
     * @param contexts The contexts to capture.
     */
    ConsoleLoggingService.prototype.startCapture = function (contexts) {
        this._log = [];
        this._captureContexts = contexts;
    };
    /**
     * Stop capturing and return the captured logging.
     */
    ConsoleLoggingService.prototype.stopCapture = function () {
        var log = this._log;
        this._log = undefined;
        return log;
    };
    /**
     * Format a capture into readable text.
     */
    ConsoleLoggingService.prototype.formatCapture = function (capture) {
        var log = [];
        if (capture) {
            for (var i = 0; i < capture.length; i++) {
                if (capture[i].err) {
                    log.push("[" + capture[i].context + "] Error::" + capture[i].message);
                }
                else {
                    log.push("[" + capture[i].context + "] " + capture[i].message);
                }
                if (capture[i].params) {
                    capture[i].params.map(function (p) {
                        log.push(p.toString());
                    });
                }
            }
        }
        return log;
    };
    return ConsoleLoggingService;
}());
exports.ConsoleLoggingService = ConsoleLoggingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZUxvZ2dpbmdTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnNvbGVMb2dnaW5nU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ0g7SUFpQ0k7OztPQUdHO0lBQ0gsK0JBQVksZUFBMEI7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxtQ0FBRyxHQUFWLFVBQVcsT0FBZSxFQUFFLE9BQWU7UUFBRSxnQkFBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCwrQkFBYzs7UUFDdkQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25GLE9BQU8sQ0FBQyxHQUFHLE9BQVgsT0FBTyxHQUFLLE1BQUksT0FBTyxVQUFLLE9BQVMsU0FBSyxNQUFNLEdBQUU7U0FDckQ7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDWCxPQUFPLFNBQUE7Z0JBQ1AsT0FBTyxTQUFBO2dCQUNQLE1BQU0sUUFBQTthQUNULENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0kscUNBQUssR0FBWjtRQUNJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0kscUNBQUssR0FBWixVQUFhLE9BQWUsRUFBRSxPQUFlLEVBQUUsR0FBVTtRQUFFLGdCQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLCtCQUFjOztRQUNyRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkYsT0FBTyxDQUFDLEtBQUssT0FBYixPQUFPLEdBQU8sTUFBSSxPQUFPLFVBQUssT0FBTyxZQUFTLEVBQUUsR0FBRyxTQUFLLE1BQU0sR0FBRTtTQUNuRTtRQUNELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNYLE9BQU8sU0FBQTtnQkFDUCxPQUFPLFNBQUE7Z0JBQ1AsR0FBRyxLQUFBO2dCQUNILE1BQU0sUUFBQTthQUNULENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDRDQUFZLEdBQW5CLFVBQW9CLFFBQWtCO1FBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQ0FBVyxHQUFsQjtRQWtCSSxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksNkNBQWEsR0FBcEIsVUFBcUIsT0FpQmxCO1FBQ0MsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsSUFBSSxPQUFPLEVBQUU7WUFDVCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO29CQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8saUJBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQVMsQ0FBQyxDQUFDO2lCQUNwRTtxQkFBTTtvQkFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sVUFBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBUyxDQUFDLENBQUM7aUJBQzdEO2dCQUNELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtvQkFDbkIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO3dCQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMzQixDQUFDLENBQUMsQ0FBQztpQkFDTjthQUNKO1NBQ0o7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDTCw0QkFBQztBQUFELENBQUMsQUFuS0QsSUFtS0M7QUFuS1ksc0RBQXFCIn0=