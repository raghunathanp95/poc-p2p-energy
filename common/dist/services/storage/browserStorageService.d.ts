import { IStorageService } from "../../models/services/IStorageService";
/**
 * Class to use local browser storage.
 */
export declare class BrowserStorageService<T> implements IStorageService<T> {
    /**
     * The root folder for the browser storage.
     */
    private readonly _rootFolder;
    /**
     * Create a new instance of BrowserStorageService
     * @param rootFolder The root folder for the browser storage.
     */
    constructor(rootFolder: string);
    /**
     * Load an item from local storage.
     * @param id The id of the item to load.
     * @returns The item loaded.
     */
    get(id: string): Promise<T>;
    /**
     * Save an item to local storage.
     * @param id The id of the item to store.
     * @param item The item to store.
     */
    set(id: string, item: T): Promise<void>;
    /**
     * Remove an item from storage.
     * @param id The id of the item to store.
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
