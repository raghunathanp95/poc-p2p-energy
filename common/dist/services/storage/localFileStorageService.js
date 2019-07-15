"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Service to handle the storage using local files.
 */
class LocalFileStorageService {
    /**
     * Create a new instance of LocalFileStorageService
     * @param folder The local folder to store the data.
     */
    constructor(folder) {
        this._folder = folder;
    }
    /**
     * Get the item.
     * @param id The id of the item.
     * @returns The item read from local storage.
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield fs_1.default.promises.readFile(path_1.default.join(this._folder, `${id}.json`));
                return JSON.parse(file.toString());
            }
            catch (err) {
                return undefined;
            }
        });
    }
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     * @returns Nothing.
     */
    set(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.default.promises.mkdir(this._folder, { recursive: true });
                yield fs_1.default.promises.writeFile(path_1.default.join(this._folder, `${id}.json`), JSON.stringify(item, undefined, "\t"));
            }
            catch (err) {
                return undefined;
            }
        });
    }
    /**
     * Delete the item.
     * @param id The id of the item to delete.
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.default.promises.unlink(path_1.default.join(this._folder, `${id}.json`));
            }
            catch (err) {
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
                    const entries = yield fs_1.default.promises.readdir(path_1.default.join(this._folder, context));
                    const ids = entries.map(e => e.replace(/\.json$/, ""));
                    const items = [];
                    for (let i = 0; i < ids.length; i++) {
                        items.push(yield this.get(ids[i]));
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
exports.LocalFileStorageService = LocalFileStorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxGaWxlU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc3RvcmFnZS9sb2NhbEZpbGVTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUd4Qjs7R0FFRztBQUNILE1BQWEsdUJBQXVCO0lBTWhDOzs7T0FHRztJQUNILFlBQVksTUFBYztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLEdBQUcsQ0FBQyxFQUFVOztZQUN2QixJQUFJO2dCQUNBLE1BQU0sSUFBSSxHQUFHLE1BQU0sWUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDdEM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixPQUFPLFNBQVMsQ0FBQzthQUNwQjtRQUNMLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1UsR0FBRyxDQUFDLEVBQVUsRUFBRSxJQUFPOztZQUNoQyxJQUFJO2dCQUNBLE1BQU0sWUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDN0c7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixPQUFPLFNBQVMsQ0FBQzthQUNwQjtRQUNMLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNVLE1BQU0sQ0FBQyxFQUFVOztZQUMxQixJQUFJO2dCQUNBLE1BQU0sWUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ25FO1lBQUMsT0FBTyxHQUFHLEVBQUU7YUFDYjtRQUNMLENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNVLElBQUksQ0FBQyxPQUFnQixFQUFFLElBQXNCLEVBQUUsUUFBMEI7O1lBc0JsRixJQUFJO2dCQUNBLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtvQkFDWixNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUU1RSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDdkQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdEM7b0JBRUQsT0FBTzt3QkFDSCxHQUFHO3dCQUNILEtBQUs7d0JBQ0wsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNO3dCQUN4QixVQUFVLEVBQUUsQ0FBQzt3QkFDYixRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU07cUJBQ3pCLENBQUM7aUJBQ0w7YUFDSjtZQUFDLE9BQU8sR0FBRyxFQUFFO2FBQ2I7WUFDRCxPQUFPO2dCQUNILEdBQUcsRUFBRSxFQUFFO2dCQUNQLEtBQUssRUFBRSxFQUFFO2dCQUNULFVBQVUsRUFBRSxDQUFDO2dCQUNiLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFFBQVEsRUFBRSxDQUFDO2FBQ2QsQ0FBQztRQUNOLENBQUM7S0FBQTtDQUNKO0FBL0dELDBEQStHQyJ9