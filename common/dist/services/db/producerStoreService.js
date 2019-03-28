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
var ProducerStoreService = /** @class */ (function (_super) {
    __extends(ProducerStoreService, _super);
    /**
     * Create a new instance of ProducerStoreService.
     * @param config Configuration for DB.
     */
    function ProducerStoreService(config) {
        return _super.call(this, config, ProducerStoreService.TABLE_NAME, "id") || this;
    }
    /**
     * The name of the database table.
     */
    ProducerStoreService.TABLE_NAME = "producerStore";
    return ProducerStoreService;
}(amazonDynamoDbService_1.AmazonDynamoDbService));
exports.ProducerStoreService = ProducerStoreService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJTdG9yZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvZGIvcHJvZHVjZXJTdG9yZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEseUVBQXdFO0FBRXhFOztHQUVHO0FBQ0g7SUFBMEMsd0NBQXNDO0lBTTVFOzs7T0FHRztJQUNILDhCQUFZLE1BQWlDO2VBQ3pDLGtCQUFNLE1BQU0sRUFBRSxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0lBQ3hELENBQUM7SUFYRDs7T0FFRztJQUNvQiwrQkFBVSxHQUFXLGVBQWUsQ0FBQztJQVNoRSwyQkFBQztDQUFBLEFBYkQsQ0FBMEMsNkNBQXFCLEdBYTlEO0FBYlksb0RBQW9CIn0=