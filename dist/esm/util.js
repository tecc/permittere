/*
 * Copyright 2022 tecc
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Permission error. Generic, standard, boring.
 */
export class PermissionError extends Error {
    /**
     * Construct a new permission error.
     * @param message - The error message.
     */
    constructor(message) {
        super(message);
    }
}
/**
 * Checks if a value is null or undefined.
 * @param value - The value to check.
 * @returns Whether the value is null or undefined or not.
 */
export function isNull(value) {
    return typeof value === "undefined" || value === null;
}
/**
 * Checks if a value is an array.
 * @param value - The value to check.
 * @returns Whether the value is an array or not.
 */
export function isArray(value) {
    return !isNull(value) && Array.isArray(value);
}
/**
 * Checks if a value is a string.
 * @param value - The value to check.
 * @returns Whether the value is a string or not.
 */
export function isString(value) {
    return typeof value === 'string';
}
//# sourceMappingURL=util.js.map