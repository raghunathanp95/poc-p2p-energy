import { ILoggingService, IMamCommand, IRegistration, ServiceFactory } from "poc-p2p-energy-grid-common";

/**
 * Service to handle the grid.
 */
export class GridService {
    /**
     * Service to log output to.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * Create a new instance of GridService.
     */
    constructor() {
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
    }

    /**
     * Should we create a return channel when adding a registration.
     * @param registration The registration to check.
     */
    public shouldCreateReturnChannel(registration: IRegistration): boolean {
        return registration.itemType === "consumer";
    }

    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    public async handleCommands(registration: IRegistration, commands: IMamCommand[]): Promise<void> {
        for (let i = 0; i < commands.length; i++) {
            this._loggingService.log("grid", "Processing", commands);
        }
        this._loggingService.log(
            "grid",
            `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`
        );
    }
}
