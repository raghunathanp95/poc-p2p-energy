import { IIdItem } from "./IIdItem";

export interface IConsumer extends IIdItem {
    /**
     * The wallet seed for the consumer.
     */
    walletSeed?: string;
}
