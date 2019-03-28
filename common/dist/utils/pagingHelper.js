"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to help with paging lists.
 */
var PagingHelper = /** @class */ (function () {
    function PagingHelper() {
    }
    /**
     * Make sure the request has sensible paging values.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns The first and last item indexes based on paging request.
     */
    PagingHelper.normalizeRequest = function (page, pageSize) {
        var normalizedPage = page === undefined ? 0 : +page;
        var normalizedPageSize = Math.max(pageSize === undefined ? 10 : +pageSize, 5);
        return {
            firstItem: normalizedPage * normalizedPageSize,
            lastItem: (normalizedPage + 1) * normalizedPageSize,
            normalizedPage: normalizedPage,
            normalizedPageSize: normalizedPageSize
        };
    };
    /**
     * Build a paging response.
     * @param request The paging request.
     * @param totalItems The total number of items available.
     * @param items The sub list of items.
     * @returns The first and last item indexes based on paging request.
     */
    PagingHelper.buildResponse = function (request, totalItems, items) {
        return {
            items: items,
            totalPages: Math.ceil(totalItems / +request.pageSize),
            totalItems: totalItems,
            pageSize: +request.pageSize
        };
    };
    return PagingHelper;
}());
exports.PagingHelper = PagingHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5nSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3BhZ2luZ0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBOztHQUVHO0FBQ0g7SUFBQTtJQW1EQSxDQUFDO0lBbERHOzs7OztPQUtHO0lBQ1csNkJBQWdCLEdBQTlCLFVBQStCLElBQXNCLEVBQUUsUUFBMEI7UUFrQjdFLElBQU0sY0FBYyxHQUFHLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdEQsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEYsT0FBTztZQUNILFNBQVMsRUFBRSxjQUFjLEdBQUcsa0JBQWtCO1lBQzlDLFFBQVEsRUFBRSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsR0FBRyxrQkFBa0I7WUFDbkQsY0FBYyxnQkFBQTtZQUNkLGtCQUFrQixvQkFBQTtTQUNyQixDQUFDO0lBQ04sQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNXLDBCQUFhLEdBQTNCLFVBQStCLE9BQXNCLEVBQUUsVUFBa0IsRUFBRSxLQUFVO1FBQ2pGLE9BQU87WUFDSCxLQUFLLE9BQUE7WUFDTCxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ3JELFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRO1NBQzlCLENBQUM7SUFDTixDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBbkRELElBbURDO0FBbkRZLG9DQUFZIn0=