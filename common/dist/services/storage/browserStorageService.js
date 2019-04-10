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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to use local browser storage.
 */
var BrowserStorageService = /** @class */ (function () {
    /**
     * Create a new instance of BrowserStorageService
     * @param rootFolder The root folder for the browser storage.
     */
    function BrowserStorageService(rootFolder) {
        this._rootFolder = rootFolder;
    }
    /**
     * Load an item from local storage.
     * @param id The id of the item to load.
     * @returns The item loaded.
     */
    BrowserStorageService.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, json;
            return __generator(this, function (_a) {
                if (window.localStorage) {
                    try {
                        json = window.localStorage.getItem(this._rootFolder + "/" + id);
                        if (json) {
                            obj = JSON.parse(json);
                        }
                    }
                    catch (err) {
                        // Nothing to do
                    }
                }
                return [2 /*return*/, obj];
            });
        });
    };
    /**
     * Save an item to local storage.
     * @param id The id of the item to store.
     * @param item The item to store.
     */
    BrowserStorageService.prototype.set = function (id, item) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                if (window.localStorage) {
                    try {
                        json = JSON.stringify(item);
                        window.localStorage.setItem(this._rootFolder + "/" + id, json);
                    }
                    catch (err) {
                        // Nothing to do
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Remove an item from storage.
     * @param id The id of the item to store.
     */
    BrowserStorageService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (window.localStorage) {
                    try {
                        window.localStorage.removeItem(this._rootFolder + "/" + id);
                    }
                    catch (err) {
                        // Nothing to do
                    }
                }
                return [2 /*return*/];
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
    BrowserStorageService.prototype.page = function (context, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var items, ids, allKeys, keySep, i, key;
            return __generator(this, function (_a) {
                try {
                    if (page === 0) {
                        items = [];
                        ids = [];
                        allKeys = window.localStorage.length;
                        keySep = this._rootFolder + "/";
                        for (i = 0; i < allKeys; i++) {
                            key = window.localStorage.key(i);
                            if (key && key.startsWith(keySep)) {
                                ids.push(key.substr(keySep.length));
                                items.push(JSON.parse(window.localStorage.getItem(key)));
                            }
                        }
                        return [2 /*return*/, {
                                ids: ids,
                                items: items,
                                totalItems: items.length,
                                totalPages: 1,
                                pageSize: items.length
                            }];
                    }
                }
                catch (err) {
                }
                return [2 /*return*/, {
                        ids: [],
                        items: [],
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0
                    }];
            });
        });
    };
    return BrowserStorageService;
}());
exports.BrowserStorageService = BrowserStorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclN0b3JhZ2VTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3N0b3JhZ2UvYnJvd3NlclN0b3JhZ2VTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7R0FFRztBQUNIO0lBTUk7OztPQUdHO0lBQ0gsK0JBQVksVUFBa0I7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxtQ0FBRyxHQUFoQixVQUFpQixFQUFVOzs7O2dCQUV2QixJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7b0JBQ3JCLElBQUk7d0JBQ00sSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFJLElBQUksQ0FBQyxXQUFXLFNBQUksRUFBSSxDQUFDLENBQUM7d0JBRXRFLElBQUksSUFBSSxFQUFFOzRCQUNOLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3lCQUMxQjtxQkFDSjtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDVixnQkFBZ0I7cUJBQ25CO2lCQUNKO2dCQUVELHNCQUFPLEdBQUcsRUFBQzs7O0tBQ2Q7SUFFRDs7OztPQUlHO0lBQ1UsbUNBQUcsR0FBaEIsVUFBaUIsRUFBVSxFQUFFLElBQU87Ozs7Z0JBQ2hDLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSTt3QkFDTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDbEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUksSUFBSSxDQUFDLFdBQVcsU0FBSSxFQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ2xFO29CQUFDLE9BQU8sR0FBRyxFQUFFO3dCQUNWLGdCQUFnQjtxQkFDbkI7aUJBQ0o7Ozs7S0FDSjtJQUVEOzs7T0FHRztJQUNVLHNDQUFNLEdBQW5CLFVBQW9CLEVBQVU7OztnQkFDMUIsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO29CQUNyQixJQUFJO3dCQUNBLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFJLElBQUksQ0FBQyxXQUFXLFNBQUksRUFBSSxDQUFDLENBQUM7cUJBQy9EO29CQUFDLE9BQU8sR0FBRyxFQUFFO3dCQUNWLGdCQUFnQjtxQkFDbkI7aUJBQ0o7Ozs7S0FDSjtJQUVEOzs7Ozs7T0FNRztJQUNVLG9DQUFJLEdBQWpCLFVBQWtCLE9BQWdCLEVBQUUsSUFBc0IsRUFBRSxRQUEwQjs7OztnQkFzQmxGLElBQUk7b0JBQ0EsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO3dCQUNOLEtBQUssR0FBRyxFQUFFLENBQUM7d0JBQ1gsR0FBRyxHQUFHLEVBQUUsQ0FBQzt3QkFDVCxPQUFPLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7d0JBRXJDLE1BQU0sR0FBTSxJQUFJLENBQUMsV0FBVyxNQUFHLENBQUM7d0JBRXRDLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUN4QixHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0NBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQ0FDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDNUQ7eUJBQ0o7d0JBRUQsc0JBQU87Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILEtBQUssT0FBQTtnQ0FDTCxVQUFVLEVBQUUsS0FBSyxDQUFDLE1BQU07Z0NBQ3hCLFVBQVUsRUFBRSxDQUFDO2dDQUNiLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTTs2QkFDekIsRUFBQztxQkFDTDtpQkFDSjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtpQkFDYjtnQkFDRCxzQkFBTzt3QkFDSCxHQUFHLEVBQUUsRUFBRTt3QkFDUCxLQUFLLEVBQUUsRUFBRTt3QkFDVCxVQUFVLEVBQUUsQ0FBQzt3QkFDYixVQUFVLEVBQUUsQ0FBQzt3QkFDYixRQUFRLEVBQUUsQ0FBQztxQkFDZCxFQUFDOzs7S0FDTDtJQUNMLDRCQUFDO0FBQUQsQ0FBQyxBQWpJRCxJQWlJQztBQWpJWSxzREFBcUIifQ==