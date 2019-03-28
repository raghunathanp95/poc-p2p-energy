import { GridData } from "../../models/api/gridData";

export interface GridState {
    /**
     * The grid name.
     */
    gridName?: string;

    /**
     * The grid data.
     */
    gridData?: GridData;

    /**
     * Is the form data valid.
     */
    isValid?: boolean;

    /**
     * Is the form busy.
     */
    isBusy?: boolean;

    /**
     * Did any operations error.
     */
    isErrored?: boolean;

    /**
     * Status of form operations.
     */
    status: string;
}
