"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the producer store.
 */
class ProducerOutputPaymentService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    /**
     * Create a new instance of ProducerOutputPaymentService.
     * @param config Configuration for DB.
     */
    constructor(config) {
        super(config, ProducerOutputPaymentService.TABLE_NAME, "id");
    }
}
exports.ProducerOutputPaymentService = ProducerOutputPaymentService;
/**
 * The name of the database table.
 */
ProducerOutputPaymentService.TABLE_NAME = "producerOutputPayment";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJPdXRwdXRQYXltZW50U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9kYi9wcm9kdWNlck91dHB1dFBheW1lbnRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsMkVBQXdFO0FBRXhFOztHQUVHO0FBQ0gsTUFBYSw0QkFBNkIsU0FBUSw2Q0FBNkM7SUFNM0Y7OztPQUdHO0lBQ0gsWUFBWSxNQUFpQztRQUN6QyxLQUFLLENBQUMsTUFBTSxFQUFFLDRCQUE0QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDOztBQVpMLG9FQWFDO0FBWkc7O0dBRUc7QUFDb0IsdUNBQVUsR0FBVyx1QkFBdUIsQ0FBQyJ9