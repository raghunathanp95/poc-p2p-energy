import { IGrid } from "./IGrid";

export interface IGridPutRequest {
    /**
     * The name of the grid.
     */
    name: string;

    /**
     * The data for the grid to update.
     */
    grid: IGrid;
}
