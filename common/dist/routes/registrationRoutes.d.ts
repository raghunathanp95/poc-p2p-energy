import { IResponse } from "../models/api/IResponse";
import { IRegistrationDeleteRequest } from "../models/api/registration/IRegistrationDeleteRequest";
import { IRegistrationSetRequest } from "../models/api/registration/IRegistrationSetRequest";
import { IRegistrationSetResponse } from "../models/api/registration/IRegistrationSetResponse";
/**
 * Registration post command.
 */
export declare function registrationSet(config: any, request: IRegistrationSetRequest): Promise<IRegistrationSetResponse>;
/**
 * Registration delete command.
 */
export declare function registrationDelete(config: any, request: IRegistrationDeleteRequest): Promise<IResponse>;
