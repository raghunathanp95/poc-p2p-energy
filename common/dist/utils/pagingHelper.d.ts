import { IPagedRequest } from "../models/api/IPagedRequest";
import { IPagedResponse } from "../models/api/IPagedResponse";
/**
 * Class to help with paging lists.
 */
export declare class PagingHelper {
    /**
     * Make sure the request has sensible paging values.
     * @param page The page number to get.
     * @param pageSize The page size to get.
     * @returns The first and last item indexes based on paging request.
     */
    static normalizeRequest(page?: number | string, pageSize?: number | string): {
        /**
         * The first item to retrieve for the page.
         */
        firstItem: number;
        /**
         * The last item to retrieve for the page.
         */
        lastItem: number;
        /**
         * The normalized page.
         */
        normalizedPage: number;
        /**
         * The normalized page size.
         */
        normalizedPageSize: number;
    };
    /**
     * Build a paging response.
     * @param request The paging request.
     * @param totalItems The total number of items available.
     * @param items The sub list of items.
     * @returns The first and last item indexes based on paging request.
     */
    static buildResponse<T>(request: IPagedRequest, totalItems: number, items: T[]): IPagedResponse<T>;
}
