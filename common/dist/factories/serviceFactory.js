"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Factory for creating services.
 */
class ServiceFactory {
    /**
     * Register a new service.
     * @param name The name of the service.
     * @param instanceCallback The callback to create an instance.
     */
    static register(name, instanceCallback) {
        this._services[name] = instanceCallback;
        if (this._instances[name]) {
            delete this._instances[name];
        }
    }
    /**
     * Unregister a service.
     * @param name The name of the service to unregister.
     */
    static unregister(name) {
        delete this._services[name];
        if (this._instances[name]) {
            delete this._instances[name];
        }
    }
    /**
     * Get a service instance.
     * @param name The name of the service to get.
     * @returns An instance of the service.
     */
    static get(name) {
        if (!this._instances[name] && this._services[name]) {
            this._instances[name] = this._services[name]();
        }
        return this._instances[name];
    }
}
/**
 * Store the service callbacks.
 */
ServiceFactory._services = {};
/**
 * Store the created instances.
 */
ServiceFactory._instances = {};
exports.ServiceFactory = ServiceFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZUZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFjdG9yaWVzL3NlcnZpY2VGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFVdkI7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBWSxFQUFFLGdCQUEyQjtRQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLGdCQUFnQixDQUFDO1FBQ3hDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFJLElBQVk7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUNsRDtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDOztBQTFDRDs7R0FFRztBQUNxQix3QkFBUyxHQUFrQyxFQUFFLENBQUM7QUFDdEU7O0dBRUc7QUFDcUIseUJBQVUsR0FBNEIsRUFBRSxDQUFDO0FBUnJFLHdDQTRDQyJ9