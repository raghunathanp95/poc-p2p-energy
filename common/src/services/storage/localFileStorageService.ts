import fs from "fs";
import path from "path";
import { IStorageService } from "../../models/services/IStorageService";

/**
 * Service to handle the storage using local files.
 */
export class LocalFileStorageService<T> implements IStorageService<T> {
    /**
     * The folder for local storage.
     */
    private readonly _folder: string;

    /**
     * The registration id.
     */
    private readonly _registrationId: string;

    /**
     * The name of the context.
     */
    private readonly _contextName: string;

    /**
     * Create a new instance of LocalFileStorageService
     * @param folder The local folder to store the data.
     * @param registrationId The registration id.
     * @param contextName The name of the context to store with.
     */
    constructor(folder: string, registrationId: string, contextName: string) {
        this._folder = folder;
        this._registrationId = registrationId;
        this._contextName = contextName;
    }

    /**
     * Get the item.
     * @param id The id of the item.
     */
    public async get(id: string): Promise<T> {
        try {
            const fullFilename = path.join(this._folder, this._registrationId, this._contextName, `${id}.json`);
            const file = await fs.promises.readFile(fullFilename);
            return JSON.parse(file.toString());
        } catch (err) {
            return undefined;
        }
    }

    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    public async set(id: string, item: T): Promise<void> {
        try {
            const fullFolder = path.join(this._folder, this._registrationId, this._contextName);
            await fs.promises.mkdir(fullFolder, { recursive: true });
            await fs.promises.writeFile(path.join(fullFolder, `${id}.json`), JSON.stringify(item, undefined, "\t"));
        } catch (err) {
            return undefined;
        }
    }

    /**
     * Delete the item.
     * @param item The item to store.
     */
    public async remove(id: string): Promise<void> {
        try {
            const fullFilename = path.join(this._folder, this._registrationId, this._contextName, `${id}.json`);
            await fs.promises.unlink(fullFilename);
        } catch (err) {
        }
    }

    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    public async page(context?: string, page?: number | string, pageSize?: number | string): Promise<{
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
    }> {
        try {
            if (page === 0) {
                const fullFolder = path.join(this._folder, this._registrationId, this._contextName);
                const entries = await fs.promises.readdir(fullFolder);

                const ids = entries.map(e => e.replace(/\.json$/, ""));
                const items = [];
                for (let i = 0; i < ids.length; i++) {
                    items.push(await this.get(ids[i]));
                }

                return {
                    ids,
                    items,
                    totalItems: items.length,
                    totalPages: 1,
                    pageSize: items.length
                };
            }
        } catch (err) {
        }
        return {
            ids: [],
            items: [],
            totalItems: 0,
            totalPages: 0,
            pageSize: 0
        };
    }
}
