"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
                    const keySep = `${this._rootFolder}/`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclN0b3JhZ2VTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3N0b3JhZ2UvYnJvd3NlclN0b3JhZ2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQTs7R0FFRztBQUNILE1BQWEscUJBQXFCO0lBTTlCOzs7T0FHRztJQUNILFlBQVksVUFBa0I7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxHQUFHLENBQUMsRUFBVTs7WUFDdkIsSUFBSSxHQUFHLENBQUM7WUFDUixJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUk7b0JBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRXRFLElBQUksSUFBSSxFQUFFO3dCQUNOLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMxQjtpQkFDSjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDVixnQkFBZ0I7aUJBQ25CO2FBQ0o7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxHQUFHLENBQUMsRUFBVSxFQUFFLElBQU87O1lBQ2hDLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtnQkFDckIsSUFBSTtvQkFDQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ2xFO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNWLGdCQUFnQjtpQkFDbkI7YUFDSjtRQUNMLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNVLE1BQU0sQ0FBQyxFQUFVOztZQUMxQixJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUk7b0JBQ0EsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQy9EO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNWLGdCQUFnQjtpQkFDbkI7YUFDSjtRQUNMLENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNVLElBQUksQ0FBQyxPQUFnQixFQUFFLElBQXNCLEVBQUUsUUFBMEI7O1lBc0JsRixJQUFJO2dCQUNBLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtvQkFDWixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2pCLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDZixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztvQkFFM0MsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUM7b0JBRXRDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzlCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFOzRCQUMvQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzVEO3FCQUNKO29CQUVELE9BQU87d0JBQ0gsR0FBRzt3QkFDSCxLQUFLO3dCQUNMLFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTTt3QkFDeEIsVUFBVSxFQUFFLENBQUM7d0JBQ2IsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNO3FCQUN6QixDQUFDO2lCQUNMO2FBQ0o7WUFBQyxPQUFPLEdBQUcsRUFBRTthQUNiO1lBQ0QsT0FBTztnQkFDSCxHQUFHLEVBQUUsRUFBRTtnQkFDUCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxVQUFVLEVBQUUsQ0FBQztnQkFDYixVQUFVLEVBQUUsQ0FBQztnQkFDYixRQUFRLEVBQUUsQ0FBQzthQUNkLENBQUM7UUFDTixDQUFDO0tBQUE7Q0FDSjtBQWpJRCxzREFpSUMifQ==