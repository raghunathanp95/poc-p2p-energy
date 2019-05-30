"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service to handle multiple logging services.
 */
class AggregateLoggingService {
    /**
     * Create a new instance of AggregateLoggingService.
     * @param services The list of services to aggregate.
     */
    constructor(services) {
        this._services = services;
    }
    /**
     * Log the message.
     * @param context The context for the log.
     * @param message The message to log.
     * @param params The parameters to log.
     */
    log(context, message, ...params) {
        for (let i = 0; i < this._services.length; i++) {
            this._services[i].log(context, message, ...params);
        }
    }
    /**
     * Log a break.
     */
    break() {
        for (let i = 0; i < this._services.length; i++) {
            this._services[i].break();
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
        for (let i = 0; i < this._services.length; i++) {
            this._services[i].error(context, message, err, ...params);
        }
    }
}
exports.AggregateLoggingService = AggregateLoggingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlTG9nZ2luZ1NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvbG9nZ2luZy9hZ2dyZWdhdGVMb2dnaW5nU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ0gsTUFBYSx1QkFBdUI7SUFNaEM7OztPQUdHO0lBQ0gsWUFBWSxRQUEyQjtRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFHLE1BQVc7UUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztTQUN0RDtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDUixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM3QjtJQUNMLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxHQUFVLEVBQUUsR0FBRyxNQUFXO1FBQ3JFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztDQUNKO0FBL0NELDBEQStDQyJ9