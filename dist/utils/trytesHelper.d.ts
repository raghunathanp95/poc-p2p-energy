/**
 * Helper functions for use with trytes.
 */
export declare class TrytesHelper {
    /**
     * Convert an object to Trytes.
     * @param obj The obj to encode.
     * @returns The encoded trytes value.
     */
    static toTrytes(obj: any): string;
    /**
     * Convert an object from Trytes.
     * @param trytes The trytes to decode.
     * @returns The decoded object.
     */
    static fromTrytes<T>(trytes: string): T;
    /**
     * Convert trytes to a number.
     * @param trytes The trytes string to convert
     * @returns The numeric value of the trytes or zero.
     */
    static toNumber(trytes: string): number;
    /**
     * Convert number to trytes.
     * @param val The number to convert.
     * @returns The trytes of the number.
     */
    static fromNumber(val: number): string;
    /**
     * Generate a random hash.
     * @param length The length of the hash.
     * @returns The hash.
     */
    static generateHash(length?: number): string;
}
