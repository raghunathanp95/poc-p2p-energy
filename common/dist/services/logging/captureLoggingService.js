"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service to handle console logging.
 */
class CaptureLoggingService {
    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    log(context, message, ...params) {
        if (this._log && (!this._contexts || this._contexts.indexOf(context) >= 0)) {
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
        if (this._log) {
            this._log.push({
                context: "",
                message: ""
            });
        }
    }
    /**
     * Log the error.
     * @param context The context for the log.
     * @param message The message to log.
     * @param err The error to log.
     * @param params The parameters to log.
     */
    error(context, message, err, ...params) {
        if (this._log && (!this._contexts || this._contexts.indexOf(context) >= 0)) {
            this._log.push({
                context,
                message,
                err,
                params
            });
        }
    }
    /**
     * Enable the logging for the given contexts.
     * @param contexts The context to monitor.
     */
    enable(contexts) {
        this._contexts = contexts;
        this._log = [];
    }
    /**
     * Disable the logging.
     */
    disable() {
        this._contexts = undefined;
        this._log = undefined;
    }
    /**
     * Get the logged items filter by context.
     */
    getCapture() {
        const log = this._log;
        if (log) {
            this._log = [];
        }
        return log;
    }
    /**
     * Format a capture into readable text.
     */
    formatCapture(capture) {
        const formatted = [];
        if (capture) {
            for (let i = 0; i < capture.length; i++) {
                if (capture[i].err) {
                    formatted.push(`[${capture[i].context}] Error::${capture[i].message}`);
                }
                else {
                    if (capture[i].context === "" && capture[i].message === "") {
                        formatted.push("");
                    }
                    else {
                        formatted.push(`[${capture[i].context}] ${capture[i].message}`);
                    }
                }
                if (capture[i].params) {
                    capture[i].params.map(p => {
                        formatted.push(p.toString());
                    });
                }
            }
        }
        return formatted;
    }
}
exports.CaptureLoggingService = CaptureLoggingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdHVyZUxvZ2dpbmdTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2xvZ2dpbmcvY2FwdHVyZUxvZ2dpbmdTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0E7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQVc5Qjs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBZSxFQUFFLEdBQUcsTUFBVztRQUN2RCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsT0FBTztnQkFDUCxPQUFPO2dCQUNQLE1BQU07YUFDVCxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDUixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDWCxPQUFPLEVBQUUsRUFBRTtnQkFDWCxPQUFPLEVBQUUsRUFBRTthQUNkLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxPQUFlLEVBQUUsT0FBZSxFQUFFLEdBQVUsRUFBRSxHQUFHLE1BQVc7UUFDckUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNYLE9BQU87Z0JBQ1AsT0FBTztnQkFDUCxHQUFHO2dCQUNILE1BQU07YUFDVCxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsUUFBbUI7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksT0FBTztRQUNWLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7T0FFRztJQUNJLFVBQVU7UUFDYixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksR0FBRyxFQUFFO1lBQ0wsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7U0FDbEI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxPQUF3QjtRQUN6QyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFckIsSUFBSSxPQUFPLEVBQUU7WUFDVCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO29CQUNoQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sWUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDMUU7cUJBQU07b0JBQ0gsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTt3QkFDeEQsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDdEI7eUJBQU07d0JBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7cUJBQ25FO2lCQUNKO2dCQUNELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtvQkFDbkIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBQ2pDLENBQUMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7U0FDSjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Q0FDSjtBQWhIRCxzREFnSEMifQ==