import { IProducer } from "../../models/api/IProducer";

export interface ProducerConfigureProps {
    /**
     * The producer data.
     */
    producer: IProducer;

    /**
     * The producer was updated.
     */
    onChange(producer?: IProducer): void;
}
