/**
 * Permission error. Generic, standard, boring.
 */
export declare class PermissionError extends Error {
    /**
     * Construct a new permission error.
     * @param message - The error message.
     */
    constructor(message?: string);
}
/**
 * Checks if a value is null or undefined.
 * @param value - The value to check.
 * @returns Whether the value is null or undefined or not.
 */
export declare function isNull(value: unknown): value is null | undefined;
/**
 * Checks if a value is an array.
 * @param value - The value to check.
 * @returns Whether the value is an array or not.
 */
export declare function isArray(value: unknown): value is Array<unknown>;
/**
 * Checks if a value is a string.
 * @param value - The value to check.
 * @returns Whether the value is a string or not.
 */
export declare function isString(value: unknown): value is string;
