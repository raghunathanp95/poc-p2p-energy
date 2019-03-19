import { ILoggingService, IMamCommand, IProducerOutputCommand, IRegistration, IStorageService, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IProducerStore } from "../models/db/IProducerStore";

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
        const producerStoreService = ServiceFactory.get<IStorageService<IProducerStore>>("producer-store");
        let store = await producerStoreService.get(registration.id);
        let updatedStore = false;

        for (let i = 0; i < commands.length; i++) {
            this._loggingService.log("grid", "Processing", commands[i]);
            if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                // This mam channel will have handled any mam operation
                // at the moment there is nothing else for use to do
            } else if (commands[i].command === "output") {
                const outputCommand = <IProducerOutputCommand>commands[i];

                if (!store) {
                    store = {
                        id: registration.id,
                        output: []
                    };
                }

                // Only store output commands that we havent already seen
                if (!store.output.find(o => o.startTime === outputCommand.startTime)) {
                    store.output.push({
                        startTime: outputCommand.startTime,
                        endTime: outputCommand.endTime,
                        output: outputCommand.output,
                        askingPrice: outputCommand.askingPrice,
                        paymentAddress: outputCommand.paymentAddress
                    });

                    updatedStore = true;
                }
            }
        }

        if (updatedStore) {
            await producerStoreService.set(registration.id, store);
        }

        this._loggingService.log(
            "grid",
            `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`
        );
    }
}
