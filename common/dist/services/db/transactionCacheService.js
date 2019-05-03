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
const client_load_balancer_1 = require("@iota/client-load-balancer");
const amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the transaction cache.
 */
class TransactionCacheService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    /**
     * Create a new instance of TransactionCacheService.
     * @param config The configuration to use.
     * @param loadBalancerSettings Load balancer settings for communications.
     */
    constructor(config, loadBalancerSettings) {
        super(config, TransactionCacheService.TABLE_NAME, "id");
        this._loadBalancerSettings = loadBalancerSettings;
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
                const iota = client_load_balancer_1.composeAPI(this._loadBalancerSettings);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvZGIvdHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUE4RTtBQUc5RSwyRUFBd0U7QUFFeEU7O0dBRUc7QUFDSCxNQUFhLHVCQUF3QixTQUFRLDZDQUFtQztJQVc1RTs7OztPQUlHO0lBQ0gsWUFBWSxNQUFpQyxFQUFFLG9CQUEwQztRQUNyRixLQUFLLENBQUMsTUFBTSxFQUFFLHVCQUF1QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7T0FHRztJQUNVLEdBQUcsQ0FBQyxFQUFVOzs7OztZQUN2QixJQUFJO2dCQUNBLE1BQU0sSUFBSSxHQUFHLGlDQUFVLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBRXBELE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNuRCxPQUFPO3dCQUNILEVBQUU7d0JBQ0YsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztxQkFDL0IsQ0FBQztpQkFDTDthQUNKO1lBQUMsT0FBTyxHQUFHLEVBQUU7YUFDYjtZQUVELE9BQU8sT0FBTSxHQUFHLFlBQUMsRUFBRSxFQUFFO1FBQ3pCLENBQUM7S0FBQTs7QUF2Q0Q7O0dBRUc7QUFDb0Isa0NBQVUsR0FBVyxrQkFBa0IsQ0FBQztBQUpuRSwwREF5Q0MifQ==