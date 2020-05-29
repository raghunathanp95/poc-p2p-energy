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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxGaWxlU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc3RvcmFnZS9sb2NhbEZpbGVTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFvQjtBQUNwQixnREFBd0I7QUFHeEI7O0dBRUc7QUFDSCxNQUFhLHVCQUF1QjtJQU1oQzs7O09BR0c7SUFDSCxZQUFZLE1BQWM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxHQUFHLENBQUMsRUFBVTs7WUFDdkIsSUFBSTtnQkFDQSxNQUFNLElBQUksR0FBRyxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDL0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ3RDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxTQUFTLENBQUM7YUFDcEI7UUFDTCxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNVLEdBQUcsQ0FBQyxFQUFVLEVBQUUsSUFBTzs7WUFDaEMsSUFBSTtnQkFDQSxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdHO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxTQUFTLENBQUM7YUFDcEI7UUFDTCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDVSxNQUFNLENBQUMsRUFBVTs7WUFDMUIsSUFBSTtnQkFDQSxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNuRTtZQUFDLE9BQU8sR0FBRyxFQUFFO2FBQ2I7UUFDTCxDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDVSxJQUFJLENBQUMsT0FBZ0IsRUFBRSxJQUFzQixFQUFFLFFBQTBCOztZQXNCbEYsSUFBSTtnQkFDQSxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7b0JBQ1osTUFBTSxPQUFPLEdBQUcsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFFNUUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RDO29CQUVELE9BQU87d0JBQ0gsR0FBRzt3QkFDSCxLQUFLO3dCQUNMLFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTTt3QkFDeEIsVUFBVSxFQUFFLENBQUM7d0JBQ2IsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNO3FCQUN6QixDQUFDO2lCQUNMO2FBQ0o7WUFBQyxPQUFPLEdBQUcsRUFBRTthQUNiO1lBQ0QsT0FBTztnQkFDSCxHQUFHLEVBQUUsRUFBRTtnQkFDUCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxVQUFVLEVBQUUsQ0FBQztnQkFDYixVQUFVLEVBQUUsQ0FBQztnQkFDYixRQUFRLEVBQUUsQ0FBQzthQUNkLENBQUM7UUFDTixDQUFDO0tBQUE7Q0FDSjtBQS9HRCwwREErR0MifQ==