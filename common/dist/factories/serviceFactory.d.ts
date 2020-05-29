/**
 * Factory for creating services.
 */
export declare class ServiceFactory {
    /**
     * Store the service callbacks.
     */
    private static readonly _services;
    /**
     * Store the created instances.
     */
    private static readonly _instances;
    /**
     * Register a new service.
     * @param name The name of the service.
     * @param instanceCallback The callback to create an instance.
     */
    static register(name: string, instanceCallback: () => any): void;
    /**
     * Unregister a service.
     * @param name The name of the service to unregister.
     */
    static unregister(name: string): void;
    /**
     * Get a service instance.
     * @param name The name of the service to get.
     * @returns An instance of the service.
     */
    static get<T>(name: string): T;
}
