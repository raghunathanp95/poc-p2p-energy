/**
 * Helper functions for validating input.
 */
export declare class ValidationHelper {
    /**
     * Does the string have some content.
     * @param str The string to validate.
     * @param name The parameter name.
     * @param minLength The minimum length of the string.
     */
    static string(str: string, name: string, minLength?: number): void;
    /**
     * Is the value of one the specified items.
     * @param val The value to validate.
     * @param options The possible options.
     * @param name The parameter name.
     */
    static oneOf(val: any, options: any[], name: string): void;
    /**
     * Is the value trytes.
     * @param str The string to validate.
     * @poaram length The length to match.
     * @param name The parameter name.
     */
    static trytes(str: string, length: number, name: string): void;
    /**
     * Is the value an object.
     * @param obj The object to validate.
     * @param name The parameter name.
     */
    static object(obj: any, name: string): void;
}
