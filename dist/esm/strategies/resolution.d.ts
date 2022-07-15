import { Permission, PermissionMap } from "permittere/permissions";
import { ConflictStrategy } from "permittere/strategies/conflict";
import { PermissionState } from "permittere/strategies";
export declare type StateResolver = (which: Permission) => PermissionState;
export declare type ResolutionStrategy = (permission: Permission, map: PermissionMap, getState: StateResolver, resolve: ResolutionStrategy, conflict: ConflictStrategy) => PermissionState;
/**
 * Direct resolution strategy.
 *
 * Always returns the child state, whether explicit or implicit.
 */
export declare function direct(): ResolutionStrategy;
/**
 * Parents otherwise children resolution strategy.
 *
 * The logic is as follows:
 * 1. Check if the child has parents. If it does, return the parents.
 * 2. Else, return the child.
 */
export declare function parentsOtherwiseChildren(): ResolutionStrategy;
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
export declare function explicitParentsOverChildren(fallback?: ResolutionStrategy): ResolutionStrategy;
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
export declare function explicitChildrenOverParents(fallback?: ResolutionStrategy): ResolutionStrategy;
