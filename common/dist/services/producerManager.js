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
     * @param strategy The strategy for producing output commands.
     */
    constructor(producerConfig, loadBalancerSettings, strategy) {
        this._config = producerConfig;
        this._loadBalancerSettings = loadBalancerSettings;
        this._strategy = strategy;
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
     * @returns Any new producer output commands.
     */
    updateStrategy(endTime) {
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
                                yield this._strategy.archiveSourceOutput(pageResponse.ids[i], archive);
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
                    const addressIndex = yield this._strategy.addressIndex(this._state.producerCreated, startTime);
                    const paymentAddress = core_1.generateAddress(this._state.paymentSeed, addressIndex, 2);
                    const price = yield this._strategy.price(startTime, endTime, totalOutput);
                    const command = {
                        command: "output",
                        startTime,
                        endTime,
                        price,
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
                producerCreated: Date.now(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXJNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y2VyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EscUNBQTZDO0FBQzdDLGdFQUE2RDtBQWE3RCx3REFBcUQ7QUFDckQsMkRBQXdEO0FBRXhEOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBK0J4Qjs7Ozs7T0FLRztJQUNILFlBQ0ksY0FBc0MsRUFDdEMsb0JBQTBDLEVBQzFDLFFBQTJCO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1FBQzlCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFrQixTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQXVCLHVCQUF1QixDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7O09BRUc7SUFDVSxVQUFVOztZQUNuQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUV2QixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUVuRSxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNqQixVQUFVLEVBQ1YsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9B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