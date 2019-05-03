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
const serviceFactory_1 = require("../factories/serviceFactory");
/**
 * Basic implementation of a producer strategy.
 */
class BasicProducerStrategy {
    /**
     * Create a new instance of ProducerService.
     * @param producerConfig The configuration for the producer.
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param strategy The strategy for producing output commands.
     */
    constructor() {
        this._loggingService = serviceFactory_1.ServiceFactory.get("logging");
    }
    /**
     * Calculate the price for an output command.
     * @param startTime The start time of the output value.
     * @param endTime The end time of the output value.
     * @param combinedValue The combined value of the sources for the time slice.
     */
    price(startTime, endTime, combinedValue) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calculate a cost for the producer output slice
            // You could base this on your own costs, time of day, value etc
            return 10;
        });
    }
    /**
     * Calculate the address index to use for the output command.
     * @param producerCreated The time the producer was created.
     * @param outputTime The start time of the current output value.
     */
    addressIndex(producerCreated, outputTime) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calculate a payment address index to use based on the time, you could just always increment
            // but for this example we will use a new payment address every hour
            return Math.floor((outputTime - producerCreated) / 3600000);
        });
    }
    /**
     * Archive the source output if you need to.
     * @param sourceId The is of the source.
     * @param archiveOutputs The source output values to archive.
     */
    archiveSourceOutput(sourceId, archiveOutputs) {
        return __awaiter(this, void 0, void 0, function* () {
            // Source outputs are discarded when they are collated (still in mam stream)
            // but you can archive the used blocks if required in this callback
            this._loggingService.log("demo-grid-manager", `Archive source outputs '${sourceId}'`, archiveOutputs);
        });
    }
}
exports.BasicProducerStrategy = BasicProducerStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNQcm9kdWNlclN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvYmFzaWNQcm9kdWNlclN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRUFBNkQ7QUFLN0Q7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtJQU05Qjs7Ozs7T0FLRztJQUNIO1FBQ0ksSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBa0IsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1UsS0FBSyxDQUFDLFNBQWlCLEVBQUUsT0FBZSxFQUFFLGFBQXFCOztZQUN4RSxpREFBaUQ7WUFDakQsZ0VBQWdFO1lBQ2hFLE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUNVLFlBQVksQ0FBQyxlQUF1QixFQUFFLFVBQWtCOztZQUNqRSw4RkFBOEY7WUFDOUYsb0VBQW9FO1lBQ3BFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUNoRSxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsbUJBQW1CLENBQUMsUUFBZ0IsRUFBRSxjQUFvQzs7WUFDbkYsNEVBQTRFO1lBQzVFLG1FQUFtRTtZQUNuRSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSwyQkFBMkIsUUFBUSxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDMUcsQ0FBQztLQUFBO0NBQ0o7QUFqREQsc0RBaURDIn0=