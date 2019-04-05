import { GridState } from "./gridState";

export interface IGridStatePutRequest {
    /**
     * The name of the grid.
     */
    name: string;

    /**
     * The state to set the grid.
     */
    state: GridState;
}
