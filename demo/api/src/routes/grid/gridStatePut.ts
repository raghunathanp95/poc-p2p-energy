import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IResponse } from "p2p-energy-common/dist/models/api/IResponse";
import { IGridServiceConfiguration } from "p2p-energy-common/dist/models/config/grid/IGridServiceConfiguration";
import { ValidationHelper } from "p2p-energy-common/dist/utils/validationHelper";
import { IGridStatePutRequest } from "../../models/api/IGridStatePutRequest";
import { DemoGridManagerService } from "../../services/demoGridManagerService";

/**
 * Run a grid to keep it alive.
 */
export async function gridStatePut(
    config: IGridServiceConfiguration,
    request: IGridStatePutRequest):
    Promise<IResponse> {

    ValidationHelper.string(request.name, "name", 5);

    const demoGridManager = ServiceFactory.get<DemoGridManagerService>("demoGridManager");
    await demoGridManager.setGridState(request.name, request.state);

    return {
        success: true,
        message: "OK"
    };
}
