"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the producer store.
 */
class ProducerStoreService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    /**
     * Create a new instance of ProducerStoreService.
     * @param config Configuration for DB.
     */
    constructor(config) {
        super(config, ProducerStoreService.TABLE_NAME, "id");
    }
}
/**
 * The name of the database table.
 */
ProducerStoreService.TABLE_NAME = "producerStore";
exports.ProducerStoreService = ProducerStoreService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJTdG9yZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvZGIvcHJvZHVjZXJTdG9yZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyRUFBd0U7QUFFeEU7O0dBRUc7QUFDSCxNQUFhLG9CQUFxQixTQUFRLDZDQUFzQztJQU01RTs7O09BR0c7SUFDSCxZQUFZLE1BQWlDO1FBQ3pDLEtBQUssQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7O0FBWEQ7O0dBRUc7QUFDb0IsK0JBQVUsR0FBVyxlQUFlLENBQUM7QUFKaEUsb0RBYUMifQ==