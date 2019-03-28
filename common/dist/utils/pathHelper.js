"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper functions for using with paths.
 */
var PathHelper = /** @class */ (function () {
    function PathHelper() {
    }
    /**
     * Join the path elements.
     * @param container The top level container.
     * @param context The folder context.
     * @param id The item id.
     * @returns The combined path.
     */
    PathHelper.join = function (container, context, id) {
        var path = container + "/";
        if (context) {
            path += context + "/";
        }
        if (id) {
            path += id;
        }
        return path;
    };
    return PathHelper;
}());
exports.PathHelper = PathHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aEhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wYXRoSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSDtJQUFBO0lBa0JBLENBQUM7SUFqQkc7Ozs7OztPQU1HO0lBQ1csZUFBSSxHQUFsQixVQUFtQixTQUFpQixFQUFFLE9BQWdCLEVBQUUsRUFBVztRQUMvRCxJQUFJLElBQUksR0FBTSxTQUFTLE1BQUcsQ0FBQztRQUMzQixJQUFJLE9BQU8sRUFBRTtZQUNULElBQUksSUFBTyxPQUFPLE1BQUcsQ0FBQztTQUN6QjtRQUNELElBQUksRUFBRSxFQUFFO1lBQ0osSUFBSSxJQUFJLEVBQUUsQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FBQyxBQWxCRCxJQWtCQztBQWxCWSxnQ0FBVSJ9