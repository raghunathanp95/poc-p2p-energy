"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var core_1 = require("@iota/core");
var amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the transaction cache.
 */
var TransactionCacheService = /** @class */ (function (_super) {
    __extends(TransactionCacheService, _super);
    function TransactionCacheService(config, provider) {
        var _this = _super.call(this, config, TransactionCacheService.TABLE_NAME, "id") || this;
        _this._provider = provider;
        return _this;
    }
    /**
     * Get the transaction with the given hash.
     * @param id The hash id.
     */
    TransactionCacheService.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var iota, getTrytesResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        iota = core_1.composeAPI({
                            provider: this._provider
                        });
                        return [4 /*yield*/, iota.getTrytes([id])];
                    case 1:
                        getTrytesResponse = _a.sent();
                        if (getTrytesResponse && getTrytesResponse.length > 0) {
                            return [2 /*return*/, {
                                    id: id,
                                    trytes: getTrytesResponse[0]
                                }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, _super.prototype.get.call(this, id)];
                }
            });
        });
    };
    /**
     * The name of the database table.
     */
    TransactionCacheService.TABLE_NAME = "transactionCache";
    return TransactionCacheService;
}(amazonDynamoDbService_1.AmazonDynamoDbService));
exports.TransactionCacheService = TransactionCacheService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvZGIvdHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBd0M7QUFHeEMseUVBQXdFO0FBRXhFOztHQUVHO0FBQ0g7SUFBNkMsMkNBQW1DO0lBVzVFLGlDQUFZLE1BQWlDLEVBQUUsUUFBZ0I7UUFBL0QsWUFDSSxrQkFBTSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUUxRDtRQURHLEtBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDOztJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ1UscUNBQUcsR0FBaEIsVUFBaUIsRUFBVTs7Ozs7Ozt3QkFFYixJQUFJLEdBQUcsaUJBQVUsQ0FBQzs0QkFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTO3lCQUMzQixDQUFDLENBQUM7d0JBRXVCLHFCQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFBOzt3QkFBOUMsaUJBQWlCLEdBQUcsU0FBMEI7d0JBQ3BELElBQUksaUJBQWlCLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs0QkFDbkQsc0JBQU87b0NBQ0gsRUFBRSxJQUFBO29DQUNGLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUNBQy9CLEVBQUM7eUJBQ0w7Ozs7OzRCQUlMLHNCQUFPLGlCQUFNLEdBQUcsWUFBQyxFQUFFLENBQUMsRUFBQzs7OztLQUN4QjtJQXBDRDs7T0FFRztJQUNvQixrQ0FBVSxHQUFXLGtCQUFrQixDQUFDO0lBa0NuRSw4QkFBQztDQUFBLEFBdENELENBQTZDLDZDQUFxQixHQXNDakU7QUF0Q1ksMERBQXVCIn0=