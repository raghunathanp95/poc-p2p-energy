"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper functions for validating input.
 */
var ValidationHelper = /** @class */ (function () {
    function ValidationHelper() {
    }
    /**
     * Does the string have some content.
     * @param str The string to validate.
     * @param name The parameter name.
     * @param minLength The minimum length of the string.
     */
    ValidationHelper.string = function (str, name, minLength) {
        if (minLength === void 0) { minLength = 0; }
        if (str === undefined || str === null || str.trim().length < minLength) {
            throw new Error("The parameter '" + name + "' has an invalid value.");
        }
    };
    /**
     * Is the value of one the specified items.
     * @param val The value to validate.
     * @param options The possible options.
     * @param name The parameter name.
     */
    ValidationHelper.oneOf = function (val, options, name) {
        if (options.indexOf(val) < 0) {
            throw new Error("The parameter '" + name + "' has an invalid value.");
        }
    };
    /**
     * Is the value trytes.
     * @param str The string to validate.
     * @poaram length The length to match.
     * @param name The parameter name.
     */
    ValidationHelper.trytes = function (str, length, name) {
        if (!new RegExp("^[A-Z9]{" + length + "}$").test(str)) {
            throw new Error("The parameter '" + name + "' has an invalid value.");
        }
    };
    /**
     * Is the value an object.
     * @param obj The object to validate.
     * @param name The parameter name.
     */
    ValidationHelper.object = function (obj, name) {
        if (obj === undefined || obj === null || typeof obj !== "object") {
            throw new Error("The parameter '" + name + "' has an invalid value.");
        }
    };
    return ValidationHelper;
}());
exports.ValidationHelper = ValidationHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbkhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy92YWxpZGF0aW9uSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSDtJQUFBO0lBK0NBLENBQUM7SUE5Q0c7Ozs7O09BS0c7SUFDVyx1QkFBTSxHQUFwQixVQUFxQixHQUFXLEVBQUUsSUFBWSxFQUFFLFNBQXFCO1FBQXJCLDBCQUFBLEVBQUEsYUFBcUI7UUFDakUsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUU7WUFDcEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBa0IsSUFBSSw0QkFBeUIsQ0FBQyxDQUFDO1NBQ3BFO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csc0JBQUssR0FBbkIsVUFBb0IsR0FBUSxFQUFFLE9BQWMsRUFBRSxJQUFZO1FBQ3RELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBa0IsSUFBSSw0QkFBeUIsQ0FBQyxDQUFDO1NBQ3BFO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csdUJBQU0sR0FBcEIsVUFBcUIsR0FBVyxFQUFFLE1BQWMsRUFBRSxJQUFZO1FBQzFELElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxhQUFXLE1BQU0sT0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLElBQUksNEJBQXlCLENBQUMsQ0FBQztTQUNwRTtJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ1csdUJBQU0sR0FBcEIsVUFBcUIsR0FBUSxFQUFFLElBQVk7UUFDdkMsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLElBQUksNEJBQXlCLENBQUMsQ0FBQztTQUNwRTtJQUNMLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUEvQ0QsSUErQ0M7QUEvQ1ksNENBQWdCIn0=