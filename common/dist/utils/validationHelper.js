"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper functions for validating input.
 */
class ValidationHelper {
    /**
     * Does the string have some content.
     * @param str The string to validate.
     * @param name The parameter name.
     * @param minLength The minimum length of the string.
     */
    static string(str, name, minLength = 0) {
        if (str === undefined || str === null || str.trim().length < minLength) {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
    /**
     * Is the value of one the specified items.
     * @param val The value to validate.
     * @param options The possible options.
     * @param name The parameter name.
     */
    static oneOf(val, options, name) {
        if (options.indexOf(val) < 0) {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
    /**
     * Is the value trytes.
     * @param str The string to validate.
     * @poaram length The length to match.
     * @param name The parameter name.
     */
    static trytes(str, length, name) {
        if (!new RegExp(`^[A-Z9]{${length}}$`).test(str)) {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
    /**
     * Is the value an object.
     * @param obj The object to validate.
     * @param name The parameter name.
     */
    static object(obj, name) {
        if (obj === undefined || obj === null || typeof obj !== "object") {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
}
exports.ValidationHelper = ValidationHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbkhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy92YWxpZGF0aW9uSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCxNQUFhLGdCQUFnQjtJQUN6Qjs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBVyxFQUFFLElBQVksRUFBRSxZQUFvQixDQUFDO1FBQ2pFLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO1lBQ3BFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLElBQUkseUJBQXlCLENBQUMsQ0FBQztTQUNwRTtJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBUSxFQUFFLE9BQWMsRUFBRSxJQUFZO1FBQ3RELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BFO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFXLEVBQUUsTUFBYyxFQUFFLElBQVk7UUFDMUQsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLFdBQVcsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BFO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQVEsRUFBRSxJQUFZO1FBQ3ZDLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixJQUFJLHlCQUF5QixDQUFDLENBQUM7U0FDcEU7SUFDTCxDQUFDO0NBQ0o7QUEvQ0QsNENBK0NDIn0=