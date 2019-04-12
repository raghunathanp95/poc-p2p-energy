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
const core_1 = require("@iota/core");
const amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the bundle cache.
 */
class BundleCacheService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    constructor(config, provider) {
        super(config, BundleCacheService.TABLE_NAME, "id");
        this._provider = provider;
    }
    /**
     * Get the bundle with the given hash.
     * @param id The hash id of the bundle.
     */
    get(id) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const iota = core_1.composeAPI({
                    provider: this._provider
                });
                const findTransactionsResponse = yield iota.findTransactions({ bundles: [id] });
                if (findTransactionsResponse && findTransactionsResponse.length > 0) {
                    return {
                        id,
                        transactionHashes: findTransactionsResponse
                    };
                }
            }
            catch (err) {
            }
            return _super.get.call(this, id);
        });
    }
}
/**
 * The name of the database table.
 */
BundleCacheService.TABLE_NAME = "bundleCache";
exports.BundleCacheService = BundleCacheService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlQ2FjaGVTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2RiL2J1bmRsZUNhY2hlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUNBQXdDO0FBR3hDLDJFQUF3RTtBQUV4RTs7R0FFRztBQUNILE1BQWEsa0JBQW1CLFNBQVEsNkNBQThCO0lBV2xFLFlBQVksTUFBaUMsRUFBRSxRQUFnQjtRQUMzRCxLQUFLLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ1UsR0FBRyxDQUFDLEVBQVU7Ozs7O1lBQ3ZCLElBQUk7Z0JBQ0EsTUFBTSxJQUFJLEdBQUcsaUJBQVUsQ0FBQztvQkFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTO2lCQUMzQixDQUFDLENBQUM7Z0JBRUgsTUFBTSx3QkFBd0IsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDaEYsSUFBSSx3QkFBd0IsSUFBSSx3QkFBd0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNqRSxPQUFPO3dCQUNILEVBQUU7d0JBQ0YsaUJBQWlCLEVBQUUsd0JBQXdCO3FCQUM5QyxDQUFDO2lCQUNMO2FBQ0o7WUFBQyxPQUFPLEdBQUcsRUFBRTthQUNiO1lBRUQsT0FBTyxPQUFNLEdBQUcsWUFBQyxFQUFFLEVBQUU7UUFDekIsQ0FBQztLQUFBOztBQXBDRDs7R0FFRztBQUNvQiw2QkFBVSxHQUFXLGFBQWEsQ0FBQztBQUo5RCxnREFzQ0MifQ==