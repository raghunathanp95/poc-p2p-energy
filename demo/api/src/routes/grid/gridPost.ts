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

    ValidationHelper.object(request.grid, "grid");
    ValidationHelper.string(request.grid.name, "name", 5);

    const storageService = ServiceFactory.get<IStorageService<IGrid>>("storage");

    const grid = await storageService.get(request.grid.name);

    if (grid) {
        throw new Error(
            `The grid '${request.grid.name}' already exists.
Please choose a different name or load it instead.`
        );
    }

    await storageService.set(request.grid.name, request.grid);

    return {
        success: true,
        message: "OK"
    };
}
