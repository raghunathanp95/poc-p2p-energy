"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var converter_1 = require("@iota/converter");
var crypto = __importStar(require("crypto"));
var textHelper_1 = require("./textHelper");
/**
 * Helper functions for use with trytes.
 */
var TrytesHelper = /** @class */ (function () {
    function TrytesHelper() {
    }
    /**
     * Convert an object to Trytes.
     * @param obj The obj to encode.
     * @returns The encoded trytes value.
     */
    TrytesHelper.toTrytes = function (obj) {
        var json = JSON.stringify(obj);
        var encoded = textHelper_1.TextHelper.encodeNonASCII(json);
        return encoded ? converter_1.asciiToTrytes(encoded) : "";
    };
    /**
     * Convert an object from Trytes.
     * @param trytes The trytes to decode.
     * @returns The decoded object.
     */
    TrytesHelper.fromTrytes = function (trytes) {
        // Trim trailing 9s
        var trimmed = trytes.replace(/\9+$/, "");
        // And make sure it is even length (2 trytes per ascii char)
        if (trimmed.length % 2 === 1) {
            trimmed += "9";
        }
        var ascii = converter_1.trytesToAscii(trimmed);
        var json = textHelper_1.TextHelper.decodeNonASCII(ascii);
        return json ? JSON.parse(json) : undefined;
    };
    /**
     * Convert trytes to a number.
     * @param trytes The trytes string to convert
     * @returns The numeric value of the trytes or zero.
     */
    TrytesHelper.toNumber = function (trytes) {
        return trytes ? parseInt(converter_1.trytesToAscii(trytes), 10) : 0;
    };
    /**
     * Convert number to trytes.
     * @param val The number to convert.
     * @returns The trytes of the number.
     */
    TrytesHelper.fromNumber = function (val) {
        return converter_1.asciiToTrytes(Math.floor(val).toString());
    };
    /**
     * Generate a random hash.
     * @param length The length of the hash.
     * @returns The hash.
     */
    TrytesHelper.generateHash = function (length) {
        if (length === void 0) { length = 81; }
        var hash = "";
        var randomValues = new Uint32Array(crypto.randomBytes(length));
        for (var i = 0; i < length; i++) {
            hash += converter_1.TRYTE_ALPHABET.charAt(randomValues[i] % 27);
        }
        return hash;
    };
    return TrytesHelper;
}());
exports.TrytesHelper = TrytesHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJ5dGVzSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3RyeXRlc0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0U7QUFDL0UsNkNBQWlDO0FBQ2pDLDJDQUEwQztBQUUxQzs7R0FFRztBQUNIO0lBQUE7SUFrRUEsQ0FBQztJQWpFRzs7OztPQUlHO0lBQ1cscUJBQVEsR0FBdEIsVUFBdUIsR0FBUTtRQUMzQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQU0sT0FBTyxHQUFHLHVCQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hELE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyx5QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7O09BSUc7SUFDVyx1QkFBVSxHQUF4QixVQUE0QixNQUFjO1FBQ3RDLG1CQUFtQjtRQUNuQixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV6Qyw0REFBNEQ7UUFDNUQsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxJQUFJLEdBQUcsQ0FBQztTQUNsQjtRQUVELElBQU0sS0FBSyxHQUFHLHlCQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsdUJBQVUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNXLHFCQUFRLEdBQXRCLFVBQXVCLE1BQWM7UUFDakMsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx5QkFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDVyx1QkFBVSxHQUF4QixVQUF5QixHQUFXO1FBQ2hDLE9BQU8seUJBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7O09BSUc7SUFDVyx5QkFBWSxHQUExQixVQUEyQixNQUFtQjtRQUFuQix1QkFBQSxFQUFBLFdBQW1CO1FBQzFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVkLElBQU0sWUFBWSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVqRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdCLElBQUksSUFBSSwwQkFBYyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDdkQ7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBbEVELElBa0VDO0FBbEVZLG9DQUFZIn0=