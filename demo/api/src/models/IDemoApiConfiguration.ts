import { IAWSS3Configuration } from "poc-p2p-energy-grid-common";
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
