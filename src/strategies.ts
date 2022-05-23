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

import { type ConflictStrategy, coerceToFalse, coerceToTrue, prefer } from "permittere/strategies/conflict";
import { type ResolutionStrategy, direct, parentsOtherwiseChildren, explicitChildrenOverParents, explicitParentsOverChildren } from "permittere/strategies/resolution";

export type PermissionState = {
    permitted: boolean;
    coerced?: boolean;
    explicit: boolean;
}

export const defaults: {
    readonly conflict: ConflictStrategy;
    readonly resolution: ResolutionStrategy;
} = {
    conflict: prefer(true, coerceToFalse),
    resolution: explicitChildrenOverParents()
};

export { ConflictStrategy, coerceToFalse, coerceToTrue, prefer };
export { ResolutionStrategy, direct, parentsOtherwiseChildren, explicitChildrenOverParents, explicitParentsOverChildren }