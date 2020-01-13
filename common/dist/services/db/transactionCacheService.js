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
     * @returns The transaction.
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
exports.TransactionCacheService = TransactionCacheService;
/**
 * The name of the database table.
 */
TransactionCacheService.TABLE_NAME = "transactionCache";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvZGIvdHJhbnNhY3Rpb25DYWNoZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxRUFBOEU7QUFHOUUsMkVBQXdFO0FBRXhFOztHQUVHO0FBQ0gsTUFBYSx1QkFBd0IsU0FBUSw2Q0FBbUM7SUFXNUU7Ozs7T0FJRztJQUNILFlBQVksTUFBaUMsRUFBRSxvQkFBMEM7UUFDckYsS0FBSyxDQUFDLE1BQU0sRUFBRSx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO0lBQ3RELENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsR0FBRyxDQUFDLEVBQVU7Ozs7O1lBQ3ZCLElBQUk7Z0JBQ0EsTUFBTSxJQUFJLEdBQUcsaUNBQVUsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFFcEQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ25ELE9BQU87d0JBQ0gsRUFBRTt3QkFDRixNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO3FCQUMvQixDQUFDO2lCQUNMO2FBQ0o7WUFBQyxPQUFPLEdBQUcsRUFBRTthQUNiO1lBRUQsT0FBTyxPQUFNLEdBQUcsWUFBQyxFQUFFLEVBQUU7UUFDekIsQ0FBQztLQUFBOztBQXpDTCwwREEwQ0M7QUF6Q0c7O0dBRUc7QUFDb0Isa0NBQVUsR0FBVyxrQkFBa0IsQ0FBQyJ9