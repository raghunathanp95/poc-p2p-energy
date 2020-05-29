"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the consumer usage.
 */
class ConsumerUsageStoreService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    /**
     * Create a new instance of ConsumerUsageStoreService.
     * @param config Configuration for DB.
     */
    constructor(config) {
        super(config, ConsumerUsageStoreService.TABLE_NAME, "id");
    }
}
exports.ConsumerUsageStoreService = ConsumerUsageStoreService;
/**
 * The name of the database table.
 */
ConsumerUsageStoreService.TABLE_NAME = "consumerUsageStore";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXJVc2FnZVN0b3JlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9kYi9jb25zdW1lclVzYWdlU3RvcmVTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsMkVBQXdFO0FBRXhFOztHQUVHO0FBQ0gsTUFBYSx5QkFBMEIsU0FBUSw2Q0FBcUM7SUFNaEY7OztPQUdHO0lBQ0gsWUFBWSxNQUFpQztRQUN6QyxLQUFLLENBQUMsTUFBTSxFQUFFLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RCxDQUFDOztBQVpMLDhEQWFDO0FBWkc7O0dBRUc7QUFDb0Isb0NBQVUsR0FBVyxvQkFBb0IsQ0FBQyJ9