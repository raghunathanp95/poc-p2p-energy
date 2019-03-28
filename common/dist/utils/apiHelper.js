"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to help with api calls.
 */
var ApiHelper = /** @class */ (function () {
    function ApiHelper() {
    }
    /**
     * Join params onto command.
     * @param command The command.
     * @param params The params to add.
     */
    ApiHelper.joinParams = function (command, params) {
        var newCommand = command;
        for (var i = 0; i < params.length; i++) {
            if (params[i]) {
                newCommand += "/" + encodeURIComponent(params[i]);
            }
        }
        return newCommand;
    };
    /**
     * Remove the keys from the object.
     * @param obj The object to remove the keys from.
     * @param keys The keys to remove.
     * @returns The object with keys removed.
     */
    ApiHelper.removeKeys = function (obj, keys) {
        var ret = {};
        var objKeys = Object.keys(obj);
        for (var i = 0; i < objKeys.length; i++) {
            if (keys.indexOf(objKeys[i]) < 0) {
                ret[objKeys[i]] = obj[objKeys[i]];
            }
        }
        return ret;
    };
    return ApiHelper;
}());
exports.ApiHelper = ApiHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2FwaUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0g7SUFBQTtJQWlDQSxDQUFDO0lBaENHOzs7O09BSUc7SUFDVyxvQkFBVSxHQUF4QixVQUF5QixPQUFlLEVBQUUsTUFBYTtRQUNuRCxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUM7UUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1gsVUFBVSxJQUFJLE1BQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFHLENBQUM7YUFDckQ7U0FFSjtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNXLG9CQUFVLEdBQXhCLFVBQXlCLEdBQVEsRUFBRSxJQUFjO1FBQzdDLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDOUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyQztTQUNKO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLEFBakNELElBaUNDO0FBakNZLDhCQUFTIn0=