import { IResponse } from "../IResponse";
import { IWallet } from "./IWallet";

export interface IWalletGetResponse extends IResponse {
    /**
     * The wallet.
     */
    wallet?: IWallet;
}
