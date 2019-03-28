"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var amazonDynamoDbService_1 = require("../amazon/amazonDynamoDbService");
/**
 * Service to handle the producer store.
 */
var ProducerOutputPaymentService = /** @class */ (function (_super) {
    __extends(ProducerOutputPaymentService, _super);
    /**
     * Create a new instance of ProducerStoreService.
     * @param config Configuration for DB.
     */
    function ProducerOutputPaymentService(config) {
        return _super.call(this, config, ProducerOutputPaymentService.TABLE_NAME, "id") || this;
    }
    /**
     * The name of the database table.
     */
    ProducerOutputPaymentService.TABLE_NAME = "producerOutputPayment";
    return ProducerOutputPaymentService;
}(amazonDynamoDbService_1.AmazonDynamoDbService));
exports.ProducerOutputPaymentService = ProducerOutputPaymentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJPdXRwdXRQYXltZW50U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9kYi9wcm9kdWNlck91dHB1dFBheW1lbnRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHlFQUF3RTtBQUV4RTs7R0FFRztBQUNIO0lBQWtELGdEQUE2QztJQU0zRjs7O09BR0c7SUFDSCxzQ0FBWSxNQUFpQztlQUN6QyxrQkFBTSxNQUFNLEVBQUUsNEJBQTRCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztJQUNoRSxDQUFDO0lBWEQ7O09BRUc7SUFDb0IsdUNBQVUsR0FBVyx1QkFBdUIsQ0FBQztJQVN4RSxtQ0FBQztDQUFBLEFBYkQsQ0FBa0QsNkNBQXFCLEdBYXRFO0FBYlksb0VBQTRCIn0=