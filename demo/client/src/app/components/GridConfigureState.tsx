import { IProducer } from "../../models/api/IProducer";

export interface GridConfigureState {
    /**
     * The grid name.
     */
    gridName: string;

    /**
     * The grid password.
     */
    password: string;

    /**
     * The grid password for configuring.
     */
    passwordConfigure: string;

    /**
     * The producers to configure.
     */
    producers: IProducer[];

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
     * Is the operation successful.
     */
    isSuccess?: boolean;

    /**
     * Status of form operations.
     */
    status: string;

    /**
     * Do we need a password to configure the grid.
     */
    passwordSupplied?: boolean;

    /**
     * The producer to configure.
     */
    configureProducer?: IProducer;

    /**
     * The producer to delete.
     */
    deleteProducer?: IProducer;

    /**
     * The delete modal.
     */
    showDelete: boolean;

    /**
     * Redirect back to main page.
     */
    redirect: boolean;
}
