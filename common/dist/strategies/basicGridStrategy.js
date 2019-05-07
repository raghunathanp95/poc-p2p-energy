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
/**
 * Basic implementation of a grid strategy.
 */
class BasicGridStrategy {
    /**
     * Initialise the state.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                runningCostsBalance: 0,
                producerPaidBalance: 0,
                producerOwedBalance: 0,
                consumerOwedBalance: 0,
                consumerReceivedBalance: 0
            };
        });
    }
    /**
     * Collated consumers usage.
     * @param consumerUsageById The unread output from the consumers.
     * @param gridState The current state of the grid.
     */
    consumers(consumerUsageById, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Collated producer output.
     * @param producerUsageById The unread output from the producers.
     * @param gridState The current state of the grid.
     */
    producers(producerUsageById, gridState) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.BasicGridStrategy = BasicGridStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNHcmlkU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RyYXRlZ2llcy9iYXNpY0dyaWRTdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUE7O0dBRUc7QUFDSCxNQUFhLGlCQUFpQjtJQUMxQjs7T0FFRztJQUNVLElBQUk7O1lBQ2IsT0FBTztnQkFDSCxtQkFBbUIsRUFBRSxDQUFDO2dCQUN0QixtQkFBbUIsRUFBRSxDQUFDO2dCQUN0QixtQkFBbUIsRUFBRSxDQUFDO2dCQUN0QixtQkFBbUIsRUFBRSxDQUFDO2dCQUN0Qix1QkFBdUIsRUFBRSxDQUFDO2FBQzdCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ1UsU0FBUyxDQUNsQixpQkFBMEQsRUFDMUQsU0FBcUQ7O1FBRXpELENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxTQUFTLENBQ2xCLGlCQUEyRCxFQUMzRCxTQUFxRDs7UUFDekQsQ0FBQztLQUFBO0NBQ0o7QUFsQ0QsOENBa0NDIn0=