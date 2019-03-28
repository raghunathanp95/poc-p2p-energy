import { IResponse } from "../models/api/IResponse";
import { IStorageDeleteRequest } from "../models/api/storage/IStorageDeleteRequest";
import { IStorageGetRequest } from "../models/api/storage/IStorageGetRequest";
import { IStorageGetResponse } from "../models/api/storage/IStorageGetResponse";
import { IStorageListRequest } from "../models/api/storage/IStorageListRequest";
import { IStorageListResponse } from "../models/api/storage/IStorageListResponse";
import { IStorageSetRequest } from "../models/api/storage/IStorageSetRequest";
/**
 * Storage get command.
 */
export declare function storageGet(config: any, request: IStorageGetRequest): Promise<IStorageGetResponse<any>>;
/**
 * Storage set command.
 */
export declare function storageSet(config: any, request: IStorageSetRequest, body: any): Promise<IResponse>;
/**
 * Storage delete command.
 */
export declare function storageDelete(config: any, request: IStorageDeleteRequest): Promise<IResponse>;
/**
 * Storage list command.
 */
export declare function storageList(config: any, request: IStorageListRequest): Promise<IStorageListResponse<any>>;
