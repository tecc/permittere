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

import * as conflict from "permittere/strategies/conflict";
import { PermissionState } from "permittere/strategies";
import { isNull } from "permittere/util";

const explicitFalse: PermissionState = { explicit: true, permitted: false };
const explicitTrue: PermissionState = { explicit: true, permitted: true };
const implicitFalse: PermissionState = { explicit: false, permitted: false };
const implicitTrue: PermissionState = { explicit: false, permitted: true };

const all = [ explicitFalse, explicitTrue, implicitFalse, implicitTrue ] as const;

test("coerceToFalse", () => {
    for (const a of all) {
        for (const b of all) {
            let expectation = a.permitted && b.permitted;
            expect(conflict.coerceToFalse([ a, b ]))
              .toHaveProperty("permitted", expectation);
        }
    }
});

test("coerceToTrue", () => {
    for (const a of all) {
        for (const b of all) {
            let expectation = a.permitted || b.permitted;
            expect(conflict.coerceToTrue([ a, b ]))
              .toHaveProperty("permitted", expectation);
        }
    }
});

test("prefer(false, coerceToFalse)", () => {
    const strategy = conflict.prefer(false, conflict.coerceToFalse);
    let result;
    // These should work as coerceToFalse as they introduce a conflict
    for (const a of all) {
        // TODO: Test with more than 2 states
        const reverse: PermissionState = {
            permitted: !a.permitted,
            explicit: a.explicit
        };

        for (const b of [ a, reverse ]) {
            let expectation = a.permitted && b.permitted;
            result = strategy([ a, b ]);
            expect(result)
              .toHaveProperty("permitted", expectation);
            expect(result)
              .toHaveProperty("coerced", true);
            result = strategy([ b, a ]);
            expect(result)
              .toHaveProperty("permitted", expectation);
            expect(result)
              .toHaveProperty("coerced", true);
        }
    }

    // Now it's time to test the main feature
    for (const a of all) {
        const reverse1: PermissionState = {
            explicit: !a.explicit,
            permitted: a.permitted
        };
        const reverse2: PermissionState = {
            explicit: !a.explicit,
            permitted: !a.permitted
        };

        for (const b of [ a, reverse1, reverse2 ]) {
            const coercionExpectation = a.explicit === b.explicit;
            const permittedExpectation = coercionExpectation ? a.permitted && b.permitted : a.explicit ? b.permitted : a.permitted;
            const explicitnessExpectation = coercionExpectation ? a.explicit : false;

            result = strategy([ a, b ]);
            expect(result)
              .toHaveProperty("permitted", permittedExpectation);
            expect(result)
              .toHaveProperty("explicit", explicitnessExpectation);
            if (coercionExpectation || !isNull(result.coerced)) {
                expect(result)
                  .toHaveProperty("coerced", coercionExpectation);
            }
        }
    }
});

// TODO: Add tests for all other conflict strategies