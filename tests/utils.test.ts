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

import { isArray, isString, PermissionError } from "permittere/util";

const ITERATIONS = 100;

test("isString(with a string)", () => {
    for (let i = 0; i < ITERATIONS; i++) {
        const string = Math.random().toString();

        expect(isString(string)).toEqual(true);
    }
});
test("isString(with not a string)", () => {
    for (let i = 0; i < ITERATIONS; i++) {
        const number = Math.random();
        const array = ["this is a string though: " + number];
        const boolean = number > 0.5;

        expect(isString(number)).toEqual(false);
        expect(isString(array)).toEqual(false);
        expect(isString(boolean)).toEqual(false);
    }
})

test("isArray(with an array)", () => {
    const array = [];
    for (let i = 0; i < ITERATIONS; i++) {
        expect(isArray(array)).toEqual(true);
        array.push(Math.random(), "something");
    }
});
test("isArray(with not an array)", () => {
    for (let i = 0; i < ITERATIONS; i++) {
        expect(isArray(i)).toEqual(false);
        expect(isArray(Math.random())).toEqual(false);
        expect(isArray("NOT A STRING NUMBER " + i)).toEqual(false);
    }
})

test("PermissionError", () => {
    for (let i = 0; i < ITERATIONS; i++) {
        const err = new PermissionError();
        expect(() => { throw err; }).toThrow(err);
    }
})