"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the bundle cache.
 */
class BundleCacheService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    constructor(config) {
        super(config, BundleCacheService.TABLE_NAME, "id");
    }
}
exports.BundleCacheService = BundleCacheService;
/**
 * The name of the database table.
 */
BundleCacheService.TABLE_NAME = "bundleCache";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlQ2FjaGVTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2RiL2J1bmRsZUNhY2hlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDJFQUF3RTtBQUV4RTs7R0FFRztBQUNILE1BQWEsa0JBQW1CLFNBQVEsNkNBQThCO0lBTWxFLFlBQVksTUFBaUM7UUFDekMsS0FBSyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7QUFSTCxnREFTQztBQVJHOztHQUVHO0FBQ29CLDZCQUFVLEdBQVcsYUFBYSxDQUFDIn0=