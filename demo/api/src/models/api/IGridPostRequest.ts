import { IGrid } from "./IGrid";

export interface IGridPostRequest {
    /**
     * The name of the grid.
     */
    name: string;

    /**
     * The data for the grid.
     */
    grid: IGrid;
}
