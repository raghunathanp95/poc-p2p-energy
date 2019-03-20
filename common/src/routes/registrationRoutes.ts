import { ServiceFactory } from "../factories/serviceFactory";
import { IResponse } from "../models/api/IResponse";
import { IRegistrationDeleteRequest } from "../models/api/registration/IRegistrationDeleteRequest";
import { IRegistrationSetRequest } from "../models/api/registration/IRegistrationSetRequest";
import { IRegistrationSetResponse } from "../models/api/registration/IRegistrationSetResponse";
import { ILoggingService } from "../models/services/ILoggingService";
import { IRegistrationService } from "../models/services/IRegistrationService";
import { IStorageService } from "../models/services/IStorageService";
import { IRegistration } from "../models/services/registration/IRegistration";
import { ValidationHelper } from "../utils/validationHelper";

/**
 * Registration post command.
 */
export async function registrationSet(config: any, request: IRegistrationSetRequest):
    Promise<IRegistrationSetResponse> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    ValidationHelper.string(request.registrationId, "registrationId", 8);
    if (request.itemName) {
        ValidationHelper.string(request.itemName, "itemName");
    }
    if (request.itemType) {
        ValidationHelper.string(request.itemType, "itemType");
    }
    if (request.root) {
        ValidationHelper.trytes(request.root, 81, "root");
    }
    if (request.sideKey) {
        ValidationHelper.trytes(request.sideKey, 81, "sideKey");
    }

    const registrationService = ServiceFactory.get<IRegistrationService>("registration-management");

    const registration: IRegistration = {
        id: request.registrationId,
        created: Date.now(),
        itemName: request.itemName,
        itemType: request.itemType
    };

    loggingService.log("registration", "Set", registration);

    await registrationService.addRegistration(registration, request.root, request.sideKey);

    return {
        success: true,
        message: "OK",
        sideKey: registration.returnMamChannel && registration.returnMamChannel.sideKey,
        root: registration.returnMamChannel && registration.returnMamChannel.initialRoot
    };
}

/**
 * Registration delete command.
 */
export async function registrationDelete(config: any, request: IRegistrationDeleteRequest): Promise<IResponse> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    ValidationHelper.string(request.registrationId, "registrationId", 8);

    loggingService.log("registration", "Delete", request.registrationId);
    const registrationService = ServiceFactory.get<IRegistrationService>("registration-management");

    await registrationService.removeRegistration(request.registrationId);

    const storageService = ServiceFactory.get<IStorageService<string>>("storage");
    await storageService.remove(`${request.registrationId}/`);

    return {
        success: true,
        message: "OK"
    };
}
