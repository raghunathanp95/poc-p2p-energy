"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Factory for creating services.
 */
var ServiceFactory = /** @class */ (function () {
    function ServiceFactory() {
    }
    /**
     * Register a new service.
     * @param name The name of the service.
     * @param instanceCallback The callback to create an instance.
     */
    ServiceFactory.register = function (name, instanceCallback) {
        this._services[name] = instanceCallback;
    };
    /**
     * Unregister a service.
     * @param name The name of the service to unregister.
     */
    ServiceFactory.unregister = function (name) {
        delete this._services[name];
    };
    /**
     * Get a service instance.
     * @param name The name of the service to get.
     * @returns An instance of the service.
     */
    ServiceFactory.get = function (name) {
        if (!this._instances[name] && this._services[name]) {
            this._instances[name] = this._services[name]();
        }
        return this._instances[name];
    };
    /**
     * Store the service callbacks.
     */
    ServiceFactory._services = {};
    /**
     * Store the created instances.
     */
    ServiceFactory._instances = {};
    return ServiceFactory;
}());
exports.ServiceFactory = ServiceFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZUZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFjdG9yaWVzL3NlcnZpY2VGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSDtJQUFBO0lBc0NBLENBQUM7SUE1Qkc7Ozs7T0FJRztJQUNXLHVCQUFRLEdBQXRCLFVBQXVCLElBQVksRUFBRSxnQkFBMkI7UUFDNUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ1cseUJBQVUsR0FBeEIsVUFBeUIsSUFBWTtRQUNqQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDVyxrQkFBRyxHQUFqQixVQUFxQixJQUFZO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDbEQ7UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQXBDRDs7T0FFRztJQUNxQix3QkFBUyxHQUFrQyxFQUFFLENBQUM7SUFDdEU7O09BRUc7SUFDcUIseUJBQVUsR0FBNEIsRUFBRSxDQUFDO0lBOEJyRSxxQkFBQztDQUFBLEFBdENELElBc0NDO0FBdENZLHdDQUFjIn0=