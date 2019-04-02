import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IResponse } from "p2p-energy-common/dist/models/api/IResponse";
import { IGridServiceConfiguration } from "p2p-energy-common/dist/models/config/grid/IGridServiceConfiguration";
import { IStorageService } from "p2p-energy-common/dist/models/services/IStorageService";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IGrid } from "../../models/api/IGrid";
import { IGridPutRequest } from "../../models/api/IGridPutRequest";

/**
 * Update a grid.
 */
export async function gridPut(
    config: IGridServiceConfiguration,
    request: IGridPutRequest):
    Promise<IResponse> {

    ValidationHelper.string(request.name, "name", 5);
    ValidationHelper.object(request.grid, "grid");
    ValidationHelper.string(request.grid.name, "grid.name", 5);

    const storageService = ServiceFactory.get<IStorageService<IGrid>>("storage");

    const grid = await storageService.get(request.name);
    if (!grid) {
        throw new Error(`The grid '${request.name}' does not exist to update.`);
    }

    if (request.name !== request.grid.name) {
        const newGrid = await storageService.get(request.grid.name);
        if (newGrid) {
            throw new Error(`The grid name '${request.grid.name}' is already in use, please chose another name.`);
        }

        await storageService.remove(request.name);
    }

    await storageService.set(request.grid.name, request.grid);

    return {
        success: true,
        message: "The Grid was successfully updated."
    };
}
