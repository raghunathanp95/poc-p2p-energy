"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
/**
 * Service to handle the storage using local files.
 */
var LocalFileStorageService = /** @class */ (function () {
    /**
     * Create a new instance of LocalFileStorageService
     * @param folder The local folder to store the data.
     */
    function LocalFileStorageService(folder) {
        this._folder = folder;
    }
    /**
     * Get the item.
     * @param id The id of the item.
     */
    LocalFileStorageService.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var file, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(path_1.default.join(this._folder, id + ".json"))];
                    case 1:
                        file = _a.sent();
                        return [2 /*return*/, JSON.parse(file.toString())];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store the item.
     * @param id The id of the item to set.
     * @param item The item to set.
     */
    LocalFileStorageService.prototype.set = function (id, item) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.mkdir(this._folder, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs_1.default.promises.writeFile(path_1.default.join(this._folder, id + ".json"), JSON.stringify(item, undefined, "\t"))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete the item.
     * @param item The item to store.
     */
    LocalFileStorageService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.default.promises.unlink(path_1.default.join(this._folder, id + ".json"))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all the paged items.
     * @param context The context of the items to get.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns All the items for the page in the storage.
     */
    LocalFileStorageService.prototype.page = function (context, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var entries, ids, items, i, _a, _b, err_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        if (!(page === 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, fs_1.default.promises.readdir(this._folder)];
                    case 1:
                        entries = _c.sent();
                        ids = entries.map(function (e) { return e.replace(/\.json$/, ""); });
                        items = [];
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < ids.length)) return [3 /*break*/, 5];
                        _b = (_a = items).push;
                        return [4 /*yield*/, this.get(ids[i])];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, {
                            ids: ids,
                            items: items,
                            totalItems: items.length,
                            totalPages: 1,
                            pageSize: items.length
                        }];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_4 = _c.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, {
                            ids: [],
                            items: [],
                            totalItems: 0,
                            totalPages: 0,
                            pageSize: 0
                        }];
                }
            });
        });
    };
    return LocalFileStorageService;
}());
exports.LocalFileStorageService = LocalFileStorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxGaWxlU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc3RvcmFnZS9sb2NhbEZpbGVTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQW9CO0FBQ3BCLDhDQUF3QjtBQUd4Qjs7R0FFRztBQUNIO0lBTUk7OztPQUdHO0lBQ0gsaUNBQVksTUFBYztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHO0lBQ1UscUNBQUcsR0FBaEIsVUFBaUIsRUFBVTs7Ozs7Ozt3QkFFTixxQkFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUssRUFBRSxVQUFPLENBQUMsQ0FBQyxFQUFBOzt3QkFBeEUsSUFBSSxHQUFHLFNBQWlFO3dCQUM5RSxzQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDOzs7d0JBRW5DLHNCQUFPLFNBQVMsRUFBQzs7Ozs7S0FFeEI7SUFFRDs7OztPQUlHO0lBQ1UscUNBQUcsR0FBaEIsVUFBaUIsRUFBVSxFQUFFLElBQU87Ozs7Ozs7d0JBRTVCLHFCQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQTs7d0JBQTFELFNBQTBELENBQUM7d0JBQzNELHFCQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBSyxFQUFFLFVBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFBOzt3QkFBekcsU0FBeUcsQ0FBQzs7Ozt3QkFFMUcsc0JBQU8sU0FBUyxFQUFDOzs7OztLQUV4QjtJQUVEOzs7T0FHRztJQUNVLHdDQUFNLEdBQW5CLFVBQW9CLEVBQVU7Ozs7Ozs7d0JBRXRCLHFCQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBSyxFQUFFLFVBQU8sQ0FBQyxDQUFDLEVBQUE7O3dCQUEvRCxTQUErRCxDQUFDOzs7Ozs7Ozs7S0FHdkU7SUFFRDs7Ozs7O09BTUc7SUFDVSxzQ0FBSSxHQUFqQixVQUFrQixPQUFnQixFQUFFLElBQXNCLEVBQUUsUUFBMEI7Ozs7Ozs7NkJBdUIxRSxDQUFBLElBQUksS0FBSyxDQUFDLENBQUEsRUFBVix3QkFBVTt3QkFDTSxxQkFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUE7O3dCQUFqRCxPQUFPLEdBQUcsU0FBdUM7d0JBRWpELEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQzt3QkFDakQsS0FBSyxHQUFHLEVBQUUsQ0FBQzt3QkFDUixDQUFDLEdBQUcsQ0FBQzs7OzZCQUFFLENBQUEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7d0JBQzFCLEtBQUEsQ0FBQSxLQUFBLEtBQUssQ0FBQSxDQUFDLElBQUksQ0FBQTt3QkFBQyxxQkFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFBakMsY0FBVyxTQUFzQixFQUFDLENBQUM7Ozt3QkFEUCxDQUFDLEVBQUUsQ0FBQTs7NEJBSW5DLHNCQUFPOzRCQUNILEdBQUcsS0FBQTs0QkFDSCxLQUFLLE9BQUE7NEJBQ0wsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNOzRCQUN4QixVQUFVLEVBQUUsQ0FBQzs0QkFDYixRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU07eUJBQ3pCLEVBQUM7Ozs7OzRCQUlWLHNCQUFPOzRCQUNILEdBQUcsRUFBRSxFQUFFOzRCQUNQLEtBQUssRUFBRSxFQUFFOzRCQUNULFVBQVUsRUFBRSxDQUFDOzRCQUNiLFVBQVUsRUFBRSxDQUFDOzRCQUNiLFFBQVEsRUFBRSxDQUFDO3lCQUNkLEVBQUM7Ozs7S0FDTDtJQUNMLDhCQUFDO0FBQUQsQ0FBQyxBQTdHRCxJQTZHQztBQTdHWSwwREFBdUIifQ==