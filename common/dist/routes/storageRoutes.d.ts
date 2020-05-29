import { IResponse } from "../models/api/IResponse";
import { IStorageDeleteRequest } from "../models/api/storage/IStorageDeleteRequest";
import { IStorageGetRequest } from "../models/api/storage/IStorageGetRequest";
import { IStorageGetResponse } from "../models/api/storage/IStorageGetResponse";
import { IStorageListRequest } from "../models/api/storage/IStorageListRequest";
import { IStorageListResponse } from "../models/api/storage/IStorageListResponse";
import { IStorageSetRequest } from "../models/api/storage/IStorageSetRequest";
/**
 * Storage get command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
export declare function storageGet(config: any, request: IStorageGetRequest): Promise<IStorageGetResponse<any>>;
/**
 * Storage set command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @param body The body of the object to store.
 * @returns The route response.
 */
export declare function storageSet(config: any, request: IStorageSetRequest, body: any): Promise<IResponse>;
/**
 * Storage delete command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
export declare function storageDelete(config: any, request: IStorageDeleteRequest): Promise<IResponse>;
/**
 * Storage list command.
 * @param config The service configuration.
 * @param request The request for the route.
 * @returns The route response.
 */
export declare function storageList(config: any, request: IStorageListRequest): Promise<IStorageListResponse<any>>;
