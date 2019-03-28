import { IStorageService } from "../../models/services/IStorageService";
/**
 * Service to handle the storage using local files.
 */
export declare class LocalFileStorageService<T> implements IStorageService<T> {
    /**
     * The folder for local storage.
     */
    private readonly _folder;
    /**
     * The registration id.
     */
    private readonly _registrationId;
    /**
     * The name of the context.
     */
    private readonly _contextName;
    /**
     * Create a new instance of LocalFileStorageService
     * @param folder The local folder to store the data.
     * @param registrationId The registration id.
     * @param contextName The name of the context to store with.
     */
    constructor(folder: string, registrationId: string, contextName: string);
    /**
     * Get the item.
     * @param id The id of the item.
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
     * @param item The item to store.
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
