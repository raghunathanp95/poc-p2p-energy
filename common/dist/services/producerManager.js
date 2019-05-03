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
     * @param loadBalancerSettings Load balancer settings for communications.
     */
    constructor(producerConfig, loadBalancerSettings) {
        this._config = producerConfig;
        this._loadBalancerSettings = loadBalancerSettings;
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
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
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
                const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
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
                const itemMamChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
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
            const mamCommandChannel = new mamCommandChannel_1.MamCommandChannel(this._loadBalancerSettings);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y2VyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EscUNBQTZDO0FBQzdDLGdFQUE2RDtBQVk3RCx3REFBcUQ7QUFDckQsMkRBQXdEO0FBRXhEOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBMEJ4Qjs7OztPQUlHO0lBQ0gsWUFBWSxjQUFzQyxFQUFFLG9CQUEwQztRQUMxRixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztRQUM5QixJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUF1Qix1QkFBdUIsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ1UsVUFBVTs7WUFDbkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFFbkUsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakIsVUFBVSxFQUNWLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUNyRSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxN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