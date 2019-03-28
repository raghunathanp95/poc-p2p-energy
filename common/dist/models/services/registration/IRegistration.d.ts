import { IMamChannelConfiguration } from "../../mam/IMamChannelConfiguration";
export interface IRegistration {
    /**
     * Registration id.
     */
    id: string;
    /**
     * When was the registration created.
     */
    created: number;
    /**
     * Name of the item.
     */
    itemName: string;
    /**
     * The type of the item.
     */
    itemType: string;
    /**
     * The configuration for the items MAM channel.
     */
    itemMamChannel?: IMamChannelConfiguration;
    /**
     * The configuration for the return item MAM channel.
     */
    returnMamChannel?: IMamChannelConfiguration;
}
