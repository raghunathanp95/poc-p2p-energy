"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@iota/core");
const serviceFactory_1 = require("../factories/serviceFactory");
const trytesHelper_1 = require("../utils/trytesHelper");
const mamCommandChannel_1 = require("./mamCommandChannel");
/**
 * Class to maintain a Producer.
 */
class ProducerManager {
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param nodeConfig The configuration for a tangle node.
     */
    constructor(producerConfig, nodeConfig) {
        this._config = producerConfig;
        this._nodeConfig = nodeConfig;
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
        this._registrationService = serviceFactory_1.ServiceFactory.get("producer-registration");
    }
    /**
     * Get the state for the manager.
     */
    getState() {
        return this._state;
    }
    /**
     * Initialise the producer by registering with the Grid.
     */
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            this._loggingService.log("producer-init", "Registering with Grid");
            yield this._registrationService.register(this._config.id, this._config.name, "producer", this._state && this._state.channel && this._state.channel.initialRoot, this._state && this._state.channel && this._state.channel.sideKey);
            this._loggingService.log("producer-init", `Registered with Grid`);
            if (this._state.channel) {
                this._loggingService.log("producer-init", `Channel Config already exists`);
            }
            else {
                this._loggingService.log("producer-init", `Channel Config not found`);
                this._loggingService.log("producer-init", `Creating Channel`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                this._state.channel = {};
                yield itemMamChannel.openWritable(this._state.channel);
                this._loggingService.log("producer-init", `Creating Channel Success`);
                this._loggingService.log("producer-init", `Updating Registration`);
                yield this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.initialRoot, this._state.channel.sideKey);
                this._loggingService.log("producer-init", `Updated Registration`);
            }
            this._loggingService.log("producer-init", `Registration Complete`);
            yield this.saveState();
        });
    }
    /**
     * Reset the producer channel.
     */
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state && this._state.channel) {
                this._loggingService.log("producer-reset", `Send Channel Reset`);
                const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                yield mamCommandChannel.reset(this._state.channel);
                yield this.saveState();
                this._loggingService.log("producer-reset", `Updating Registration with Grid`);
                yield this._registrationService.register(this._config.id, this._config.name, "producer", this._state.channel.initialRoot, this._state.channel.sideKey);
                this._loggingService.log("producer-reset", `Updated Registration with Grid`);
            }
        });
    }
    /**
     * Closedown the producer by unregistering from the Grid.
     */
    closedown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state && this._state.channel) {
                this._loggingService.log("producer-closedown", `Sending Goodbye`);
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
                yield itemMamChannel.closeWritable(this._state.channel);
                this._loggingService.log("producer-closedown", `Sending Goodbye Complete`);
                this._state.channel = undefined;
            }
            this._loggingService.log("producer-closedown", `Unregistering from the Grid`);
            yield this._registrationService.unregister(this._config.id);
            this._loggingService.log("producer-closedown", `Unregistered from the Grid`);
        });
    }
    /**
     * Process commands for the registration.
     * @param registration The registration.
     * @param commands The commands to process.
     */
    handleCommands(registration, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceStoreService = serviceFactory_1.ServiceFactory.get("producer-source-output-store");
            let store = yield sourceStoreService.get(`${this._config.id}/${registration.id}`);
            let updatedStore = false;
            for (let i = 0; i < commands.length; i++) {
                this._loggingService.log("grid", "Processing", commands[i]);
                if (commands[i].command === "hello" || commands[i].command === "goodbye") {
                    // This mam channel will have handled any mam operation
                    // at the moment there is nothing else for use to do
                }
                else if (commands[i].command === "output") {
                    const outputCommand = commands[i];
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
                            output: outputCommand.output
                        });
                        updatedStore = true;
                    }
                }
            }
            if (updatedStore) {
                yield sourceStoreService.set(`${this._config.id}/${registration.id}`, store);
            }
            this._loggingService.log("producer", `Processed ${commands ? commands.length : 0} commands for '${registration.itemName}'`);
        });
    }
    /**
     * Combine the information from the sources and generate an output command.
     * @param endTime The end time of the block we want to collate.
     * @param calculatePrice Calculate the price for an output.
     * @param archiveSourceOutput The source outputs combined are removed, you can archive them with this callback.
     * @returns Any new producer output commands.
     */
    update(endTime, calculatePrice, archiveSourceOutput) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCommands = [];
            if (this._state && this._state.channel) {
                const sourceStoreService = serviceFactory_1.ServiceFactory.get("producer-source-output-store");
                let pageResponse;
                // What is the next block we want to collate
                const startTime = this._state.lastOutputTime + 1;
                let totalOutput = 0;
                const idsToRemove = [];
                let pageSize = 10;
                let page = 0;
                do {
                    // Get the sources page at a time
                    pageResponse = yield sourceStoreService.page(this._config.id, page, pageSize);
                    if (pageResponse && pageResponse.items) {
                        for (let i = 0; i < pageResponse.items.length; i++) {
                            const sourceStore = pageResponse.items[i];
                            const remaining = [];
                            const archive = [];
                            // Are there output entries in the source
                            if (sourceStore.output) {
                                // Walk the outputs from the source
                                for (let j = 0; j < sourceStore.output.length; j++) {
                                    // Does the output from the source overlap
                                    // with our current collated block
                                    const sourceOutput = sourceStore.output[j];
                                    if (sourceOutput.startTime < endTime) {
                                        const totalTime = sourceOutput.endTime - sourceOutput.startTime + 1;
                                        // The time used end either at the end of the current collated block
                                        // or the end of the source block
                                        const totalTimeUsed = (Math.min(endTime, sourceOutput.endTime) -
                                            sourceOutput.startTime) + 1;
                                        // What percentage of the time have we used
                                        const totalTimeUsedPercent = totalTimeUsed / totalTime;
                                        // Calculate how much of the output is used for the time
                                        const totalUsedOutput = totalTimeUsedPercent * sourceOutput.output;
                                        totalOutput += totalUsedOutput;
                                        // Is there any time remaining in the block
                                        if (totalTimeUsed < totalTime) {
                                            // Archive the part of the source we have used
                                            archive.push({
                                                startTime: sourceOutput.startTime,
                                                endTime: endTime,
                                                output: totalUsedOutput
                                            });
                                            // Add a new source block that starts after
                                            // the current collated block and with the output reduced
                                            // by the amount we have collated
                                            remaining.push({
                                                startTime: endTime + 1,
                                                endTime: sourceOutput.endTime,
                                                output: sourceOutput.output - totalUsedOutput
                                            });
                                        }
                                        else {
                                            // Used the whole block so archive it
                                            archive.push(sourceOutput);
                                        }
                                    }
                                    else {
                                        // No overlap so just store the slice again
                                        remaining.push(sourceOutput);
                                    }
                                }
                            }
                            if (remaining.length === 0) {
                                // If there are no more outputs in the source remove the storage for it
                                idsToRemove.push(`${this._config.id}/${pageResponse.ids[i]}`);
                            }
                            else {
                                // There are remaining source outputs so save them
                                sourceStore.output = remaining;
                                yield sourceStoreService.set(`${this._config.id}/${pageResponse.ids[i]}`, sourceStore);
                            }
                            if (archive.length > 0) {
                                archiveSourceOutput(pageResponse.ids[i], archive);
                            }
                        }
                    }
                    page++;
                    pageSize = pageResponse.pageSize;
                } while (pageResponse && pageResponse.items && pageResponse.items.length > 0);
                // Remove the sources that have no more output
                for (let i = 0; i < idsToRemove.length; i++) {
                    yield sourceStoreService.remove(idsToRemove[i]);
                }
                if (totalOutput > 0) {
                    this._state.lastOutputTime = endTime;
                    const paymentAddress = core_1.generateAddress(this._state.paymentSeed, this._state.paymentAddressIndex, 2);
                    this._state.paymentAddressIndex++;
                    const command = {
                        command: "output",
                        startTime,
                        endTime,
                        price: calculatePrice(startTime, endTime, totalOutput),
                        output: totalOutput,
                        paymentAddress
                    };
                    yield this.sendCommand(command);
                    newCommands.push(command);
                }
                else {
                    yield this.saveState();
                }
            }
            return newCommands;
        });
    }
    /**
     * Send a command to the channel.
     */
    sendCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._nodeConfig);
            yield mamCommandChannel.sendCommand(this._state.channel, command);
            yield this.saveState();
        });
    }
    /**
     * Load the state for the producer.
     */
    loadState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("producer-storage-manager-state");
            this._loggingService.log("producer", `Loading State`);
            this._state = yield storageConfigService.get(this._config.id);
            this._loggingService.log("producer", `Loaded State`);
            this._state = this._state || {
                paymentSeed: trytesHelper_1.TrytesHelper.generateHash(),
                paymentAddressIndex: 0,
                lastOutputTime: 0,
                owedBalance: 0,
                receivedBalance: 0
            };
        });
    }
    /**
     * Store the state for the producer.
     */
    saveState() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageConfigService = serviceFactory_1.ServiceFactory.get("producer-storage-manager-state");
            this._loggingService.log("producer", `Storing State`);
            yield storageConfigService.set(this._config.id, this._state);
            this._loggingService.log("producer", `Storing State Complete`);
        });
    }
}
exports.ProducerManager = ProducerManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y2VyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUNBQTZDO0FBQzdDLGdFQUE2RDtBQWE3RCx3REFBcUQ7QUFDckQsMkRBQXdEO0FBRXhEOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBMEJ4Qjs7OztPQUlHO0lBQ0gsWUFBWSxjQUFzQyxFQUFFLFVBQThCO1FBQzlFLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1FBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQWtCLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBdUIsdUJBQXVCLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNVLFVBQVU7O1lBQ25CLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBRW5FLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pCLFVBQVUsRUFDVixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFDckUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxD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