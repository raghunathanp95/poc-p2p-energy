"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper functions for use with text.
 */
var TextHelper = /** @class */ (function () {
    function TextHelper() {
    }
    /**
     * Encode Non ASCII characters to escaped characters.
     * @param value The value to encode.
     * @returns The encoded value.
     */
    TextHelper.encodeNonASCII = function (value) {
        return value ?
            value.replace(/[\u007F-\uFFFF]/g, function (chr) { return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4); }) :
            undefined;
    };
    /**
     * Decode escaped Non ASCII characters.
     * @param value The value to decode.
     * @returns The decoded value.
     */
    TextHelper.decodeNonASCII = function (value) {
        return value ?
            value.replace(/\\u([\d\w]{4})/gi, function (match, grp) { return String.fromCharCode(parseInt(grp, 16)); }) :
            undefined;
    };
    return TextHelper;
}());
exports.TextHelper = TextHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dEhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy90ZXh0SGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSDtJQUFBO0lBc0JBLENBQUM7SUFyQkc7Ozs7T0FJRztJQUNXLHlCQUFjLEdBQTVCLFVBQTZCLEtBQWE7UUFDdEMsT0FBTyxLQUFLLENBQUMsQ0FBQztZQUNWLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsVUFBQyxHQUFHLElBQUssT0FBQSxRQUFNLENBQUMsU0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUE1RCxDQUE0RCxDQUFDLENBQUMsQ0FBQztZQUMxRyxTQUFTLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDVyx5QkFBYyxHQUE1QixVQUE2QixLQUFhO1FBQ3RDLE9BQU8sS0FBSyxDQUFDLENBQUM7WUFDVixLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFVBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSyxPQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQUMsQ0FBQztZQUMzRixTQUFTLENBQUM7SUFDbEIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQXRCWSxnQ0FBVSJ9