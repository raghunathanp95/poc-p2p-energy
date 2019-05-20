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
     * @returns The wallet.
     */
    getWallet(id) {
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
     * @param toId The wallet id the payment is to.
     * @param amount The amount of the payment.
     */
    transfer(id, toId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletStateFrom = yield this._storageService.get(id);
            const walletStateTo = yield this._storageService.get(toId);
            if (walletStateFrom && walletStateTo) {
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
                        address: walletStateTo.receiveAddress,
                        value: amount,
                        tag: "P9TO9P9ENERGY9POC",
                        message: trytesHelper_1.TrytesHelper.toTrytes({
                            from: id,
                            to: toId
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNXYWxsZXRTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3dhbGxldC9iYXNpY1dhbGxldFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFFQUE4RTtBQUM5RSxxQ0FBNkM7QUFFN0MsbUVBQWdFO0FBS2hFLDJEQUF3RDtBQUV4RDs7R0FFRztBQUNILE1BQWEsa0JBQWtCO0lBZ0IzQjs7OztPQUlHO0lBQ0gsWUFBWSxvQkFBMEMsRUFBRSxVQUFrQjtRQUN0RSxJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFFOUIsSUFBSSxDQUFDLGVBQWUsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBcUMsY0FBYyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxTQUFTLENBQUMsRUFBVTs7WUFDN0IsSUFBSSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxHQUFHLGlDQUFVLENBQ25CLElBQUksQ0FBQyxxQkFBcUIsQ0FDN0IsQ0FBQztnQkFFRixNQUFNLGNBQWMsR0FBVyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO2dCQUVsQixJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDN0UsT0FBTyxHQUFHLGNBQWMsQ0FBQyxZ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