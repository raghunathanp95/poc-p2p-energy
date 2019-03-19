import { IRegistration } from "./registration/IRegistration";

/**
 * Service to handle the registrations.
 */
export interface IRegistrationService {
    /**
     * Add a new registration.
     * @param registration The registration details.
     * @param root The client mam channel root.
     * @param sideKey The client mam channel side key.
     */
    addRegistration(registration: IRegistration, root: string, sideKey: string): Promise<void>;

    /**
     * Remove a registration from the service.
     * @param registration The registration details.
     */
    removeRegistration(registrationId: string): Promise<void>;

    /**
     * Load the registrations to intialise the queues.
     */
    loadRegistrations(): Promise<void>;

    /**
     * Update the registrations, processing one registration on each pass.
     */
    updateRegistrations(): Promise<void>;
}
