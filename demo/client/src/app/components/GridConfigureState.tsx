import { IProducer } from "../../models/api/IProducer";

export interface GridConfigureState {
    /**
     * The grid name.
     */
    gridName: string;

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
     * The producer to configure.
     */
    configureProducer?: IProducer;
}
