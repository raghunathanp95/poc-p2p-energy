/**
 * Class to help with api calls.
 */
export declare class ApiHelper {
    /**
     * Join params onto command.
     * @param command The command.
     * @param params The params to add.
     * @returns The joined parameters.
     */
    static joinParams(command: string, params: any[]): string;
    /**
     * Remove the keys from the object.
     * @param obj The object to remove the keys from.
     * @param keys The keys to remove.
     * @returns The object with keys removed.
     */
    static removeKeys(obj: any, keys: string[]): any;
}
