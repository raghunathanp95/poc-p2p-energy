import { IIdItem } from "./IIdItem";
import { IPowerSlice } from "./IPowerSlice";
import { ISource } from "./ISource";

export interface IProducer extends IIdItem {
    /**
     * The list of sources.
     */
    sources: ISource[];

    /**
     * The wallet seed for the producer.
     */
    walletSeed?: string;

    /**
     * The power slices from the producer.
     */
    powerSlices?: IPowerSlice[];
}
