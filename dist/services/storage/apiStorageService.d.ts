import { IStorageService } from "../../models/services/IStorageService";
/**
 * Service to handle the storage using the storage api.
 */
export declare class ApiStorageService<T> implements IStorageService<T> {
    /**
     * The storage api endpoint.
     */
    private readonly _apiEndpoint;
    /**
     * The registration id.
     */
    private readonly _registrationId;
    /**
     * The name of the storage table.
     */
    private readonly _contextName;
    /**
     * Create a new instance of ApiStorageService
     * @param apiEndpoint The api configuration.
     * @param registrationId The registration id.
     * @param contextName The name of the context to store with.
     */
    constructor(apiEndpoint: string, registrationId: string, contextName: string);
    /**
     * Get the item.
     * @param id The id of the item.
     * @returns The item from the storage service.
     */
    get(id: string): Promise<T>;
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    set(id: string, item: T): Promise<void>;
    /**
     * Delete the item.
     * @param id The id of the item to remove.
     */
    remove(id: string): Promise<void>;
    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    page(context?: string, page?: number | string, pageSize?: number | string): Promise<{
        /**
         * The ids of the items retrieved.
         */
        ids: string[];
        /**
         * The items.
         */
        items: T[];
        /**
         * The total number of items.
         */
        totalItems: number;
        /**
         * The total number of pages.
         */
        totalPages: number;
        /**
         * The page size.
         */
        pageSize: number;
    }>;
}
