"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonDynamoDbService_1 = require("./amazonDynamoDbService");
/**
 * Service to store registrations in AmazonS3.
 */
class AmazonS3RegistrationService extends amazonDynamoDbService_1.AmazonDynamoDbService {
    /**
     * Create a new instance of RegistrationService
     * @param config The configuration.
     */
    constructor(config) {
        super(config, AmazonS3RegistrationService.TABLE_NAME, "id");
    }
}
exports.AmazonS3RegistrationService = AmazonS3RegistrationService;
/**
 * The name of the database table.
 */
AmazonS3RegistrationService.TABLE_NAME = "registration";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNSZWdpc3RyYXRpb25TZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25TM1JlZ2lzdHJhdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtRUFBZ0U7QUFFaEU7O0dBRUc7QUFDSCxNQUFhLDJCQUE0QixTQUFRLDZDQUFvQztJQU1qRjs7O09BR0c7SUFDSCxZQUFZLE1BQWlDO1FBQ3pDLEtBQUssQ0FBQyxNQUFNLEVBQUUsMkJBQTJCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7O0FBWkwsa0VBYUM7QUFaRzs7R0FFRztBQUNvQixzQ0FBVSxHQUFXLGNBQWMsQ0FBQyJ9