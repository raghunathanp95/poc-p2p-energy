import { IIdItem } from "./IIdItem";
import { IPowerSlice } from "./IPowerSlice";

export interface ISource extends IIdItem {
    /**
     * The type of the source.
     */
    type: string;

    /**
     * The power slices from the source.
     */
    powerSlices?: IPowerSlice;
}
