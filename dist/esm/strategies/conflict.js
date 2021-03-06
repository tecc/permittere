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
export const coerceToFalse = (states) => {
    return states.reduce((a, b) => {
        return {
            permitted: a.permitted && b.permitted,
            explicit: a.explicit && b.explicit,
            coerced: true
        };
    });
};
export const coerceToTrue = (states) => {
    return states.reduce((a, b) => {
        return {
            permitted: a.permitted || b.permitted,
            explicit: a.explicit || b.explicit,
            coerced: true
        };
    });
};
export function prefer(explicit, fallback) {
    return (states) => {
        // Check that they're not the same
        const matching = [];
        for (const state of states) {
            if (state.explicit === explicit) {
                matching.push(state);
            }
        }
        if (matching.length !== 1) {
            return fallback(matching.length !== 0 ? matching : states);
        }
        return Object.assign(matching[0]);
    };
}
//# sourceMappingURL=conflict.js.map