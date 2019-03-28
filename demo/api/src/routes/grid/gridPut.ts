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

    const storageService = ServiceFactory.get<IStorageService<IGrid>>("storage");

    const grid = await storageService.get(request.name);

    if (!grid) {
        throw new Error(`The grid '${request.name}' does not exist to update.`);
    }

    await storageService.set(request.name, request.grid);

    return {
        success: true,
        message: "OK"
    };
}
