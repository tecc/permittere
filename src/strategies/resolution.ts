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


import { hasParent, Permission, PermissionMap } from "permittere/permissions";
import { ConflictStrategy, prefer } from "permittere/strategies/conflict";
import { PermissionState } from "permittere/strategies";

export type StateResolver = (which: Permission) => PermissionState;
export type ResolutionStrategy = (permission: Permission, map: PermissionMap, getState: StateResolver, resolve: ResolutionStrategy, conflict: ConflictStrategy) => PermissionState;

const STRATEGY_TYPE = Symbol("Resolution strategy type");

const DIRECT = Symbol("Direct");

/**
 * Direct resolution strategy.
 *
 * Always returns the child state, whether explicit or implicit.
 */
export function direct(): ResolutionStrategy {
    const strategy: ResolutionStrategy = (permission, map, has) => {
        return has(permission);
    };

    return Object.assign(strategy, {
        [STRATEGY_TYPE]: DIRECT
    });
}

const PARENTS_OTHERWISE_CHILDREN = Symbol("Parents otherwise children");

/**
 * Parents otherwise children resolution strategy.
 *
 * The logic is as follows:
 * 1. Check if the child has parents. If it does, return the parents.
 * 2. Else, return the child.
 */
export function parentsOtherwiseChildren(): ResolutionStrategy {
    const strategy: ResolutionStrategy = (permission, map, getState, resolve, conflict) => {
        if (hasParent(permission)) {
            const parents = permission.parents as string[];
            return conflict(parents.map((parent) => resolve(map[parent], map, getState, resolve, conflict)));
        } else {
            return getState(permission);
        }
    };

    return Object.assign(strategy, {
        [STRATEGY_TYPE]: PARENTS_OTHERWISE_CHILDREN
    });
}

const EXPLICIT_PARENTS_OVER_CHILDREN = Symbol("Explicit parents over children");

/**
 * Explicit parents over children resolution strategy.
 *
 * The logic is as follows:
 * 1. Check if it has any parent.
 *   a. Check if the parents have a permission set explicitly. If it does, return the parents.
 * 2. Check if the child has a permission set explicitly. If it does, return the child.
 * 3. If neither of the previous are true, use the fallback.
 *
 * @param fallback - The fallback to use. Defaults to {@link parentsOtherwiseChildren}
 * @see ResolutionStrategy
 */
export function explicitParentsOverChildren(fallback = parentsOtherwiseChildren()): ResolutionStrategy {
    const strategy: ResolutionStrategy = (child, map, has, resolve, conflict) => {
        const preferExplicit = prefer(true, conflict);
        // Check if the child has parents
        let childHasParent = hasParent(child);

        if (childHasParent) {
            const parents = child.parents as string[];

            const parentState = preferExplicit(parents.map((v) => resolve(map[v], map, has, resolve, conflict)));
            if (parentState.explicit) {
                return parentState;
            }
        }

        const childState = has(child);
        if (childState.explicit) {
            return childState;
        }

        // parentState cannot be nullish if childHasParent is true
        return fallback(child, map, has, resolve, conflict);
    };


    return Object.assign(strategy, {
        [STRATEGY_TYPE]: EXPLICIT_PARENTS_OVER_CHILDREN
    });
}

const EXPLICIT_CHILDREN_OVER_PARENTS = Symbol("Explicit parents over children");

/**
 * Explicit children over parents strategy.
 *
 * The logic is as follows:
 * 1. Check if the child has a permission set explicitly. If it does, return the child.
 * 2. Check if it has any parent.
 *   a. Check if the parents have a permission set explicitly. If it does, return the parents.
 * 3. If neither of the previous are true, use the fallback.
 *
 * @param fallback - The fallback to use. Defaults to {@link fallback}
 * @see ResolutionStrategy
 */
export function explicitChildrenOverParents(fallback: ResolutionStrategy = direct()): ResolutionStrategy {
    const strategy: ResolutionStrategy = (child, map, has, resolve, conflict) => {
        const preferExplicit = prefer(true, conflict);

        // Check if the child has a permission set explicitly
        const childState = has(child);
        if (childState.explicit) {
            return childState;
        }

        const childHasParent = hasParent(child);


        if (childHasParent) {
            const parents = child.parents as string[];

            const parentState = preferExplicit(parents.map((parent) => resolve(map[parent], map, has, resolve, conflict)));
            if (parentState.explicit) {
                return parentState;
            }
        }

        return fallback(child, map, has, resolve, conflict);
    };

    return Object.assign(strategy, {
        [STRATEGY_TYPE]: EXPLICIT_CHILDREN_OVER_PARENTS
    });
}