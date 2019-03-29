import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IResponse } from "p2p-energy-common/dist/models/api/IResponse";
import { IGridServiceConfiguration } from "p2p-energy-common/dist/models/config/grid/IGridServiceConfiguration";
import { IStorageService } from "p2p-energy-common/dist/models/services/IStorageService";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IGrid } from "../../models/api/IGrid";
import { IGridPostRequest } from "../../models/api/IGridPostRequest";

/**
 * Create a new grid.
 */
export async function gridPost(
    config: IGridServiceConfiguration,
    request: IGridPostRequest):
    Promise<IResponse> {

    ValidationHelper.string(request.name, "name", 5);
    ValidationHelper.object(request.grid, "grid");

    const storageService = ServiceFactory.get<IStorageService<IGrid>>("storage");

    const grid = await storageService.get(request.name);

    if (grid) {
        throw new Error(
            `The grid '${request.name}' already exists.
Please choose a different name or load it instead.`
        );
    }

    await storageService.set(request.name, request.grid);

    return {
        success: true,
        message: "OK"
    };
}
