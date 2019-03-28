import { IAWSS3Configuration } from "p2p-energy-common/dist/models/config/IAWSS3Configuration";
/**
 * Definition of configuration file.
 */
export interface IDemoApiConfiguration {
    /**
     * Local storage location.
     */
    localStorageFolder?: string;

    /**
     * S3 storage connection.
     */
    s3Connection?: IAWSS3Configuration;
}
