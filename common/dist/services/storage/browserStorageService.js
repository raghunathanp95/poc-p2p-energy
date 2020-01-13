"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to use local browser storage.
 */
class BrowserStorageService {
    /**
     * Create a new instance of BrowserStorageService
     * @param rootFolder The root folder for the browser storage.
     */
    constructor(rootFolder) {
        this._rootFolder = rootFolder;
    }
    /**
     * Load an item from local storage.
     * @param id The id of the item to load.
     * @returns The item loaded.
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let obj;
            if (window.localStorage) {
                try {
                    const json = window.localStorage.getItem(`${this._rootFolder}/${id}`);
                    if (json) {
                        obj = JSON.parse(json);
                    }
                }
                catch (err) {
                    // Nothing to do
                }
            }
            return obj;
        });
    }
    /**
     * Save an item to local storage.
     * @param id The id of the item to store.
     * @param item The item to store.
     */
    set(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.localStorage) {
                try {
                    const json = JSON.stringify(item);
                    window.localStorage.setItem(`${this._rootFolder}/${id}`, json);
                }
                catch (err) {
                    // Nothing to do
                }
            }
        });
    }
    /**
     * Remove an item from storage.
     * @param id The id of the item to store.
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.localStorage) {
                try {
                    window.localStorage.removeItem(`${this._rootFolder}/${id}`);
                }
                catch (err) {
                    // Nothing to do
                }
            }
        });
    }
    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    page(context, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (page === 0) {
                    const items = [];
                    const ids = [];
                    const allKeys = window.localStorage.length;
                    let keySep = `${this._rootFolder}/`;
                    if (context) {
                        keySep += `${context}/`;
                    }
                    for (let i = 0; i < allKeys; i++) {
                        const key = window.localStorage.key(i);
                        if (key && key.startsWith(keySep)) {
                            ids.push(key.substr(keySep.length));
                            items.push(JSON.parse(window.localStorage.getItem(key)));
                        }
                    }
                    return {
                        ids,
                        items,
                        totalItems: items.length,
                        totalPages: 1,
                        pageSize: items.length
                    };
                }
            }
            catch (err) {
            }
            return {
                ids: [],
                items: [],
                totalItems: 0,
                totalPages: 0,
                pageSize: 0
            };
        });
    }
}
exports.BrowserStorageService = BrowserStorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclN0b3JhZ2VTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3N0b3JhZ2UvYnJvd3NlclN0b3JhZ2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQU05Qjs7O09BR0c7SUFDSCxZQUFZLFVBQWtCO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsR0FBRyxDQUFDLEVBQVU7O1lBQ3ZCLElBQUksR0FBRyxDQUFDO1lBQ1IsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFJO29CQUNBLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUV0RSxJQUFJLElBQUksRUFBRTt3QkFDTixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDMUI7aUJBQ0o7Z0JBQUMsT0FBTyxHQUFHLEVBQUU7b0JBQ1YsZ0JBQWdCO2lCQUNuQjthQUNKO1lBRUQsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsR0FBRyxDQUFDLEVBQVUsRUFBRSxJQUFPOztZQUNoQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUk7b0JBQ0EsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNsRTtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDVixnQkFBZ0I7aUJBQ25CO2FBQ0o7UUFDTCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDVSxNQUFNLENBQUMsRUFBVTs7WUFDMUIsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFJO29CQUNBLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUMvRDtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDVixnQkFBZ0I7aUJBQ25CO2FBQ0o7UUFDTCxDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDVSxJQUFJLENBQUMsT0FBZ0IsRUFBRSxJQUFzQixFQUFFLFFBQTBCOztZQXNCbEYsSUFBSTtnQkFDQSxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7b0JBQ1osTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNqQixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2YsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7b0JBRTNDLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDO29CQUNwQyxJQUFJLE9BQU8sRUFBRTt3QkFDVCxNQUFNLElBQUksR0FBRyxPQUFPLEdBQUcsQ0FBQztxQkFDM0I7b0JBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDOUIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7NEJBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDNUQ7cUJBQ0o7b0JBRUQsT0FBTzt3QkFDSCxHQUFHO3dCQUNILEtBQUs7d0JBQ0wsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNO3dCQUN4QixVQUFVLEVBQUUsQ0FBQzt3QkFDYixRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU07cUJBQ3pCLENBQUM7aUJBQ0w7YUFDSjtZQUFDLE9BQU8sR0FBRyxFQUFFO2FBQ2I7WUFDRCxPQUFPO2dCQUNILEdBQUcsRUFBRSxFQUFFO2dCQUNQLEtBQUssRUFBRSxFQUFFO2dCQUNULFVBQVUsRUFBRSxDQUFDO2dCQUNiLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFFBQVEsRUFBRSxDQUFDO2FBQ2QsQ0FBQztRQUNOLENBQUM7S0FBQTtDQUNKO0FBcElELHNEQW9JQyJ9