import axios from "axios";
import { IResponse } from "p2p-energy-common/dist/models/api/IResponse";
import { ApiHelper } from "p2p-energy-common/dist/utils/apiHelper";
import { IGridGetRequest } from "../models/api/IGridGetRequest";
import { IGridGetResponse } from "../models/api/IGridGetResponse";
import { IGridPostRequest } from "../models/api/IGridPostRequest";
import { IGridPutRequest } from "../models/api/IGridPutRequest";

/**
 * Class to handle api communications.
 */
export class DemoApiClient {
    /**
     * The endpoint for performing communications.
     */
    private readonly _endpoint: string;

    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the api.
     */
    constructor(endpoint: string) {
        this._endpoint = endpoint;
    }

    /**
     * Get grid data from the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async gridGet(request: IGridGetRequest): Promise<IGridGetResponse> {
        const ax = axios.create({ baseURL: this._endpoint });
        let response: IGridGetResponse;

        try {
            const axiosResponse = await ax.get<IGridGetResponse>(ApiHelper.joinParams(`grid`, [request.name]));

            response = axiosResponse.data;
        } catch (err) {
            response = {
                success: false,
                message: `There was a problem communicating with the API.\n${err}`
            };
        }

        return response;
    }

    /**
     * Create a new grid.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async gridCreate(request: IGridPostRequest): Promise<IResponse> {
        const ax = axios.create({ baseURL: this._endpoint });
        let response: IResponse;

        try {
            const axiosResponse = await ax.post<IResponse>(`grid`, request);

            response = axiosResponse.data;
        } catch (err) {
            response = {
                success: false,
                message: `There was a problem communicating with the API.\n${err}`
            };
        }

        return response;
    }

    /**
     * Update a grid with the api.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async gridUpdate(request: IGridPutRequest): Promise<IResponse> {
        const ax = axios.create({ baseURL: this._endpoint });
        let response: IResponse;

        try {
            const axiosResponse = await ax.put<IResponse>(
                ApiHelper.joinParams(`grid`, [request.name]),
                ApiHelper.removeKeys(request, ["name"]));

            response = axiosResponse.data;
        } catch (err) {
            response = {
                success: false,
                message: `There was a problem communicating with the API.\n${err}`
            };
        }

        return response;
    }
}
