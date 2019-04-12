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
 * Service to handle the transaction cache.
 */
class TransactionCacheService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    constructor(config, provider) {
        super(config, TransactionCacheService.TABLE_NAME, "id");
        this._provider = provider;
    }
    /**
     * Get the transaction with the given hash.
     * @param id The hash id.
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
                const getTrytesResponse = yield iota.getTrytes([id]);
                if (getTrytesResponse && getTrytesResponse.length > 0) {
                    return {
                        id,
                        trytes: getTrytesResponse[0]
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
TransactionCacheService.TABLE_NAME = "transactionCache";
exports.TransactionCacheService = TransactionCacheService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvZGIvdHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFDQUF3QztBQUd4QywyRUFBd0U7QUFFeEU7O0dBRUc7QUFDSCxNQUFhLHVCQUF3QixTQUFRLDZDQUFtQztJQVc1RSxZQUFZLE1BQWlDLEVBQUUsUUFBZ0I7UUFDM0QsS0FBSyxDQUFDLE1BQU0sRUFBRSx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7T0FHRztJQUNVLEdBQUcsQ0FBQyxFQUFVOzs7OztZQUN2QixJQUFJO2dCQUNBLE1BQU0sSUFBSSxHQUFHLGlCQUFVLENBQUM7b0JBQ3BCLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUztpQkFDM0IsQ0FBQyxDQUFDO2dCQUVILE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNuRCxPQUFPO3dCQUNILEVBQUU7d0JBQ0YsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztxQkFDL0IsQ0FBQztpQkFDTDthQUNKO1lBQUMsT0FBTyxHQUFHLEVBQUU7YUFDYjtZQUVELE9BQU8sT0FBTSxHQUFHLFlBQUMsRUFBRSxFQUFFO1FBQ3pCLENBQUM7S0FBQTs7QUFwQ0Q7O0dBRUc7QUFDb0Isa0NBQVUsR0FBVyxrQkFBa0IsQ0FBQztBQUpuRSwwREFzQ0MifQ==