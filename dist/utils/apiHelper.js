"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to help with api calls.
 */
class ApiHelper {
    /**
     * Join params onto command.
     * @param command The command.
     * @param params The params to add.
     * @returns The joined parameters.
     */
    static joinParams(command, params) {
        let newCommand = command;
        for (let i = 0; i < params.length; i++) {
            newCommand += `/${encodeURIComponent(params[i])}`;
        }
        return newCommand;
    }
    /**
     * Remove the keys from the object.
     * @param obj The object to remove the keys from.
     * @param keys The keys to remove.
     * @returns The object with keys removed.
     */
    static removeKeys(obj, keys) {
        const ret = {};
        const objKeys = Object.keys(obj);
        for (let i = 0; i < objKeys.length; i++) {
            if (keys.indexOf(objKeys[i]) < 0) {
                ret[objKeys[i]] = obj[objKeys[i]];
            }
        }
        return ret;
    }
}
exports.ApiHelper = ApiHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2FwaUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsTUFBYSxTQUFTO0lBQ2xCOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFlLEVBQUUsTUFBYTtRQUNuRCxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUM7UUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsVUFBVSxJQUFJLElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNyRDtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBUSxFQUFFLElBQWM7UUFDN0MsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM5QixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1NBQ0o7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQS9CRCw4QkErQkMifQ==