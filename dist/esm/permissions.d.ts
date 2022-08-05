import { type ResolutionStrategy, type ConflictStrategy, type PermissionState } from "permittere/strategies";
/**
 * Display information for a permission. Only here as a utility in case.
 */
export interface PermissionDisplay {
    /**
     * The display name of the permission.
     */
    name: string;
    /**
     * The description of the permission.
     */
    description: string;
}
export interface Permission<T = string> {
    /**
     * The name (or ID) of the permission.
     */
    name: T;
    /**
     * The parent permission of the permission.
     * Optional: no value and undefined are treated as having no parent.
     * @see #parents
     */
    parent?: string | undefined;
    /**
     * The parent permissions of the permission.
     * Optional: no value, undefined, and an empty array are treated as having no parent.
     * @see #parent
     */
    parents?: string[] | undefined;
    /**
     * The default value of the permission.
     */
    default: boolean;
    /**
     * The display information of the permission.
     * Optional, as it's more of a nice-to-have.
     */
    display?: PermissionDisplay;
}
/**
 * Generic permission type wrapper. Used for storing permission information, i.e. what permissions exist.
 */
export declare type PermissionMap<KType extends string = string> = {
    [K in KType]: Permission<K>;
};
/**
 * Generic permission wrapper. Used for storing permission states, i.e. what permissions an entity has.
 */
export declare type Permissions<T extends PermissionMap = PermissionMap> = {
    [K in keyof T]?: boolean | undefined;
};
/**
 * Resolved permissions object.
 * Acts essentially the same as a {@link Permissions} object, but all permissions have been precomputed.
 */
export declare type ResolvedPermissions<T extends PermissionMap, P extends Permissions<T> = Permissions<T>> = {
    [K in keyof T]: P[K] extends boolean ? P[K] : T[K]["default"];
};
/**
 * Check if a permission has any parents (i.e. one or more parents).
 * @param permission - The permission to check the parents of.
 * @returns Whether or not the permission has any parents.
 */
export declare function hasParent(permission: Permission): boolean;
export declare function getParents(permission: Permission): string[];
export declare function resolvePermission<T extends PermissionMap>(permission: Permission, permissions: Permissions<T>): {
    permitted: boolean;
    explicit: boolean;
};
/**
 * Permission resolution configuration.
 *
 * @see ManagedPermissionMap
 * @see ManagedPermissionMap.resolvePermissionDirectly
 * @see PermissionMapConfig
 */
export interface PermissionResolutionConfig {
    /**
     * The resolution strategy to use.
     * If none is specified, it defaults to {@link defaults.resolution}
     */
    resolve?: ResolutionStrategy;
    /**
     * The conflict strategy to use.
     * If none is specified, it defaults to {@link defaults.conflict}.
     */
    conflict?: ConflictStrategy;
}
/**
 * Permission map configuration.
 *
 * @see ManagedPermissionMap
 * @see PermissionResolutionConfig
 */
export interface PermissionMapConfig extends PermissionResolutionConfig {
    /**
     * Whether to have each permission resolution have a copy of all the permissions,
     * rather than direct access to the permissions objects themselves.
     * This will however slow permission resolution down due to deep-copying the underlying maps.
     *
     * If it's not specified, it defaults to true.
     */
    separateResolutionContexts?: boolean;
    /**
     * Whether to trust the resolvers to pass valid permissions to the direct resolvers.
     * If true, {@link ManagedPermissionMap.hasPermission} will simply trust the resolver to pass existing permissions.
     * If not, the permission map will get the permission stored in the original map before resolving the state of the map.
     *
     * Not particularly effective without {@link separateResolutionContexts}.
     *
     * If it's not specified, it defaults to false.
     */
    trustResolverPermissions?: boolean;
}
/**
 * A managed permission map.
 * Essentially wraps around a {@link PermissionMap} with a few useful utilities.
 */
export declare class ManagedPermissionMap<T extends PermissionMap = PermissionMap> {
    /**
     * The underlying map.
     */
    private map;
    /**
     * The default resolution strategy for this map.
     * @private
     */
    private resolve;
    /**
     * The default conflict strategy for this map.
     * @private
     */
    private conflict;
    /**
     * Whether to separate the resolution contexts for this map or not.
     * @private
     */
    private separateResolutionContexts;
    /**
     * Create a new permission map.
     * @param map - The underlying map
     * @param mapConfig - The configuration for the map.
     */
    constructor(map: T, mapConfig?: PermissionMapConfig);
    getPermission(permission: Permission | string): Permission<string>;
    private _resolveDirect;
    resolvePermissionDirectly(permission: Permission, permissions: Permissions<T>): PermissionState;
    /**
     * Check if a {@link Permissions} object has a specific permission according to this map.
     * @param permissionName - The permission to check.
     * @param permissions - The permissions object to get states from.
     * @param resolutionConfig - The resolution configuration to use. Defaults to the permission map's resolution configuration.
     * @returns Whether or not {@link permissions} have the specified permission ({@link permissionName}).
     */
    hasPermission(permissionName: keyof T, permissions: Permissions<T>, resolutionConfig?: PermissionResolutionConfig): boolean;
    resolvePermissions(permissions: Permissions<T>, resolutionConfig?: PermissionResolutionConfig): ResolvedPermissions<T>;
}
