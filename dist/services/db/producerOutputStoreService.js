"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the producer store.
 */
class ProducerOutputStoreService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    /**
     * Create a new instance of ProducerOutputStoreService.
     * @param config Configuration for DB.
     */
    constructor(config) {
        super(config, ProducerOutputStoreService.TABLE_NAME, "id");
    }
}
exports.ProducerOutputStoreService = ProducerOutputStoreService;
/**
 * The name of the database table.
 */
ProducerOutputStoreService.TABLE_NAME = "producerOutputStore";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJPdXRwdXRTdG9yZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvZGIvcHJvZHVjZXJPdXRwdXRTdG9yZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyRUFBd0U7QUFFeEU7O0dBRUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLDZDQUFzQztJQU1sRjs7O09BR0c7SUFDSCxZQUFZLE1BQWlDO1FBQ3pDLEtBQUssQ0FBQyxNQUFNLEVBQUUsMEJBQTBCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9ELENBQUM7O0FBWkwsZ0VBYUM7QUFaRzs7R0FFRztBQUNvQixxQ0FBVSxHQUFXLHFCQUFxQixDQUFDIn0=