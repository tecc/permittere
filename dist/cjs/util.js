"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = exports.isArray = exports.isNull = exports.PermissionError = void 0;
/**
 * Permission error. Generic, standard, boring.
 */
class PermissionError extends Error {
    /**
     * Construct a new permission error.
     * @param message - The error message.
     */
    constructor(message) {
        super(message);
    }
}
exports.PermissionError = PermissionError;
/**
 * Checks if a value is null or undefined.
 * @param value - The value to check.
 * @returns Whether the value is null or undefined or not.
 */
function isNull(value) {
    return typeof value === "undefined" || value === null;
}
exports.isNull = isNull;
/**
 * Checks if a value is an array.
 * @param value - The value to check.
 * @returns Whether the value is an array or not.
 */
function isArray(value) {
    return !isNull(value) && Array.isArray(value);
}
exports.isArray = isArray;
/**
 * Checks if a value is a string.
 * @param value - The value to check.
 * @returns Whether the value is a string or not.
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
//# sourceMappingURL=util.js.map