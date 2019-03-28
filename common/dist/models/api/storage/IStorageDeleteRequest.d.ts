export interface IStorageDeleteRequest {
    /**
     * The registration id of the item.
     */
    registrationId: string;
    /**
     * The context of the item.
     */
    context?: string;
    /**
     * The id of the item.
     */
    id?: string;
}
