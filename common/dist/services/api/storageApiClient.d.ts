import { IResponse } from "../../models/api/IResponse";
import { IStorageDeleteRequest } from "../../models/api/storage/IStorageDeleteRequest";
import { IStorageGetRequest } from "../../models/api/storage/IStorageGetRequest";
import { IStorageGetResponse } from "../../models/api/storage/IStorageGetResponse";
import { IStorageListRequest } from "../../models/api/storage/IStorageListRequest";
import { IStorageListResponse } from "../../models/api/storage/IStorageListResponse";
import { IStorageSetRequest } from "../../models/api/storage/IStorageSetRequest";
/**
 * Class to handle storage api communications.
 */
export declare class StorageApiClient {
    /**
     * The endpoint for performing communications.
     */
    private readonly _endpoint;
    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint: string);
    /**
     * Store something with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageSet(request: IStorageSetRequest, data: any): Promise<IResponse>;
    /**
     * Get something stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageGet<T>(request: IStorageGetRequest): Promise<IStorageGetResponse<T>>;
    /**
     * Delete something stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageDelete(request: IStorageDeleteRequest): Promise<IResponse>;
    /**
     * List items stored with the api.
     * @param request The request to send.
     * @param data The data to store.
     * @returns The response from the request.
     */
    storageList<T>(request: IStorageListRequest): Promise<IStorageListResponse<T>>;
}
