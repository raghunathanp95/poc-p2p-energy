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
var amazonDynamoDbService_1 = require("./amazonDynamoDbService");
/**
 * Service to store registrations in AmazonS3.
 */
var AmazonS3RegistrationService = /** @class */ (function (_super) {
    __extends(AmazonS3RegistrationService, _super);
    /**
     * Create a new instance of RegistrationService
     * @param config The configuration.
     */
    function AmazonS3RegistrationService(config) {
        return _super.call(this, config, AmazonS3RegistrationService.TABLE_NAME, "id") || this;
    }
    /**
     * The name of the database table.
     */
    AmazonS3RegistrationService.TABLE_NAME = "registration";
    return AmazonS3RegistrationService;
}(amazonDynamoDbService_1.AmazonDynamoDbService));
exports.AmazonS3RegistrationService = AmazonS3RegistrationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uUzNSZWdpc3RyYXRpb25TZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FtYXpvbi9hbWF6b25TM1JlZ2lzdHJhdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsaUVBQWdFO0FBRWhFOztHQUVHO0FBQ0g7SUFBaUQsK0NBQW9DO0lBTWpGOzs7T0FHRztJQUNILHFDQUFZLE1BQWlDO2VBQ3pDLGtCQUFNLE1BQU0sRUFBRSwyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO0lBQy9ELENBQUM7SUFYRDs7T0FFRztJQUNvQixzQ0FBVSxHQUFXLGNBQWMsQ0FBQztJQVMvRCxrQ0FBQztDQUFBLEFBYkQsQ0FBaUQsNkNBQXFCLEdBYXJFO0FBYlksa0VBQTJCIn0=