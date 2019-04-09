import { IResponse } from "p2p-energy-common/dist/models/api/IResponse";

export interface IWalletGetResponse extends IResponse {
    /**
     * The balance in the wallet.
     */
    balance?: number;
}
