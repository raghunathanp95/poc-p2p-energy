/**
 * Class to use local storage.
 */
export class LocalStorageService {
    /**
     * Load an item from local storage.
     * @param id The id of the item to load.
     * @returns The item loaded.
     */
    public async get<T>(id: string): Promise<T> {
        let obj;
        if (window.localStorage) {
            try {
                const json = window.localStorage.getItem(id);

                if (json) {
                    obj = JSON.parse(json);
                }
            } catch (err) {
                // Nothing to do
            }
        }

        return obj;
    }

    /**
     * Save an item to local storage.
     * @param id The id of the item to store.
     * @param item The item to store.
     */
    public async set<T>(id: string, item: T): Promise<void> {
        if (window.localStorage) {
            try {
                const json = JSON.stringify(item);
                window.localStorage.setItem(id, json);
            } catch (err) {
                // Nothing to do
            }
        }
    }

    /**
     * Remove an item from storage.
     * @param id The id of the item to store.
     */
    public async remove(id: string): Promise<void> {
        if (window.localStorage) {
            try {
                window.localStorage.removeItem(id);
            } catch (err) {
                // Nothing to do
            }
        }
    }

    /**
     * Clear the local storage.
     * @param rootId Clear all items that start with the root id, if undefined clear everything.
     */
    public async clear(rootId: string): Promise<void> {
        if (window.localStorage) {
            try {
                if (rootId) {
                    const itemsToRemove = [];
                    const len = window.localStorage.length;
                    for (let i = 0; i < len; i++) {
                        const key = window.localStorage.key(i);
                        if (key && key.startsWith(rootId)) {
                            itemsToRemove.push(key);
                        }
                    }
                    itemsToRemove.forEach(key => {
                        window.localStorage.removeItem(key);
                    });
                } else {
                    window.localStorage.clear();
                }
            } catch (err) {
                // Nothing to do
            }
        }
    }
}
