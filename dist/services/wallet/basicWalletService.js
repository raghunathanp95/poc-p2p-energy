"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_load_balancer_1 = require("@iota/client-load-balancer");
const core_1 = require("@iota/core");
const serviceFactory_1 = require("../../factories/serviceFactory");
const trytesHelper_1 = require("../../utils/trytesHelper");
/**
 * Service to handle wallet.
 */
class BasicWalletService {
    /**
     * Create a new instance of BasicWalletService
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param walletSeed The wallet seed.
     */
    constructor(loadBalancerSettings, walletSeed) {
        this._loadBalancerSettings = loadBalancerSettings;
        this._walletSeed = walletSeed;
        this._storageService = serviceFactory_1.ServiceFactory.get("wallet-state");
    }
    /**
     * Get the wallet details.
     * @param id The id of the wallet.
     * @param incomingEpoch Only return incoming transfers after the epoch.
     * @param outgoingEpoch Only return outgoing transfers after the epoch.
     * @returns The wallet.
     */
    getWallet(id, incomingEpoch, outgoingEpoch) {
        return __awaiter(this, void 0, void 0, function* () {
            let walletState = yield this._storageService.get(id);
            if (!walletState) {
                const iota = client_load_balancer_1.composeAPI(this._loadBalancerSettings);
                const inputsResponse = yield iota.getInputs(this._walletSeed);
                let balance = 0;
                let startIndex = 0;
                let lastIndex = 0;
                if (inputsResponse && inputsResponse.inputs && inputsResponse.inputs.length > 0) {
                    balance = inputsResponse.totalBalance;
                    startIndex = inputsResponse.inputs[0].keyIndex;
                    lastIndex = inputsResponse.inputs[inputsResponse.inputs.length - 1].keyIndex;
                }
                const receiveAddress = core_1.generateAddress(this._walletSeed, lastIndex + 1, 2);
                walletState = {
                    balance,
                    startIndex: startIndex,
                    lastIndex: lastIndex + 2,
                    receiveAddress
                };
                yield this._storageService.set(id, walletState);
            }
            return {
                balance: walletState.balance
            };
        });
    }
    /**
     * Make a payment from a wallet.
     * @param id The wallet id the payment is from.
     * @param toIdOrAddress The wallet id the payment is to or an address.
     * @param amount The amount of the payment.
     */
    transfer(id, toIdOrAddress, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletStateFrom = yield this._storageService.get(id);
            if (walletStateFrom) {
                const iota = client_load_balancer_1.composeAPI(this._loadBalancerSettings);
                const inputsResult = yield iota.getInputs(this._walletSeed, { start: walletStateFrom.startIndex });
                walletStateFrom.startIndex = inputsResult.inputs[0].keyIndex;
                walletStateFrom.balance = inputsResult.totalBalance;
                const lastUsedIndex = Math.max(inputsResult.inputs[inputsResult.inputs.length - 1].keyIndex, walletStateFrom.lastIndex);
                walletStateFrom.lastIndex = lastUsedIndex + 1;
                yield this._storageService.set(id, walletStateFrom);
                const remainderAddress = core_1.generateAddress(this._walletSeed, lastUsedIndex + 1, 2);
                const trytes = yield iota.prepareTransfers(this._walletSeed, [
                    {
                        // The to ID in our basic wallet case is actually the IOTA address
                        address: toIdOrAddress,
                        value: amount,
                        tag: "P9TO9P9ENERGY9POC",
                        message: trytesHelper_1.TrytesHelper.toTrytes({
                            from: id
                        })
                    }
                ], {
                    inputs: inputsResult.inputs,
                    remainderAddress
                });
                yield iota.sendTrytes(trytes, undefined, undefined);
            }
        });
    }
}
exports.BasicWalletService = BasicWalletService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNXYWxsZXRTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3dhbGxldC9iYXNpY1dhbGxldFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxRUFBOEU7QUFDOUUscUNBQTZDO0FBRTdDLG1FQUFnRTtBQUtoRSwyREFBd0Q7QUFFeEQ7O0dBRUc7QUFDSCxNQUFhLGtCQUFrQjtJQWdCM0I7Ozs7T0FJRztJQUNILFlBQVksb0JBQTBDLEVBQUUsVUFBa0I7UUFDdEUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO1FBQ2xELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBRTlCLElBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQXFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDVSxTQUFTLENBQUMsRUFBVSxFQUFFLGFBQXNCLEVBQUUsYUFBc0I7O1lBQzdFLElBQUksV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFckQsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDZCxNQUFNLElBQUksR0FBRyxpQ0FBVSxDQUNuQixJQUFJLENBQUMscUJBQXFCLENBQzdCLENBQUM7Z0JBRUYsTUFBTSxjQUFjLEdBQVcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFFbEIsSUFBSSxjQUFjLElBQUksY0FBYyxDQUFDLE1BQU0sSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JB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