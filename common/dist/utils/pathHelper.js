"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper functions for using with paths.
 */
class PathHelper {
    /**
     * Join the path elements.
     * @param container The top level container.
     * @param context The folder context.
     * @param id The item id.
     * @returns The combined path.
     */
    static join(container, context, id) {
        let path = `${container}/`;
        if (context) {
            path += `${context}/`;
        }
        if (id) {
            path += id;
        }
        return path;
    }
}
exports.PathHelper = PathHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aEhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wYXRoSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCxNQUFhLFVBQVU7SUFDbkI7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFpQixFQUFFLE9BQWdCLEVBQUUsRUFBVztRQUMvRCxJQUFJLElBQUksR0FBRyxHQUFHLFNBQVMsR0FBRyxDQUFDO1FBQzNCLElBQUksT0FBTyxFQUFFO1lBQ1QsSUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLENBQUM7U0FDekI7UUFDRCxJQUFJLEVBQUUsRUFBRTtZQUNKLElBQUksSUFBSSxFQUFFLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQWxCRCxnQ0FrQkMifQ==