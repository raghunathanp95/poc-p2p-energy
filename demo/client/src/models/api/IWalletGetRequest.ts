export interface IWalletGetRequest {
    /**
     * The name of the grid to get the wallet.
     */
    gridName?: string;

    /**
     * The type of the item to get the wallet.
     */
    type?: "producer" | "source" | "grid";

    /**
     * The id of the item to get the wallet.
     */
    id?: string;
}
