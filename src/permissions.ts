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
import { isArray, isNull, PermissionError } from "permittere/util";
import { type ResolutionStrategy, type ConflictStrategy, type PermissionState, defaults } from "permittere/strategies";
import createDeepcopy from "rfdc";

// I'm aware this may be excessively typed, but it's there for those who want it

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
     * The parent permissions of the permission.
     * Optional: no value, undefined, and an empty array are treated as having no parent.
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
export type PermissionMap<KType extends string = string> = {
    [K in KType]: Permission<K>;
};

/**
 * Generic permission wrapper. Used for storing permission states, i.e. what permissions an entity has.
 */
export type Permissions<T extends PermissionMap = PermissionMap> = {
    [K in keyof T]?: boolean | undefined;
};

/**
 * Resolved permissions object.
 * Acts essentially the same as a {@link Permissions} object, but all permissions have been precomputed.
 */
export type ResolvedPermissions<T extends PermissionMap,
  P extends Permissions<T> = Permissions<T>> = {
    [K in keyof T]: P[K] extends boolean ? P[K] : T[K]["default"];
};

/**
 * Check if a permission has any parents (i.e. one or more parents).
 * @param permission - The permission to check the parents of.
 * @returns Whether or not the permission has any parents.
 */
export function hasParent(permission: Permission): boolean {
    return isArray(permission.parents) && permission.parents.length > 0;
}

export function resolvePermission<T extends PermissionMap>(permission: Permission, permissions: Permissions<T>) {
    const value = permissions[permission.name];
    if (isNull(value)) {
        return {
            permitted: permission.default,
            explicit: false
        };
    }

    return {
        permitted: value,
        explicit: true
    };
}

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

const deepcopy = createDeepcopy({
    circles: false,
    proto: true
});

/**
 * A managed permission map.
 * Essentially wraps around a {@link PermissionMap} with a few useful utilities.
 */
export class ManagedPermissionMap<T extends PermissionMap = PermissionMap> {
    /**
     * The underlying map.
     */
    private map: T;
    /**
     * The default resolution strategy for this map.
     * @private
     */
    private resolve: ResolutionStrategy;
    /**
     * The default conflict strategy for this map.
     * @private
     */
    private conflict: ConflictStrategy;
    /**
     * Whether to separate the resolution contexts for this map or not.
     * @private
     */
    private separateResolutionContexts: boolean;

    /**
     * Create a new permission map.
     * @param map - The underlying map
     * @param mapConfig - The configuration for the map.
     */
    constructor(map: T, mapConfig: PermissionMapConfig = {}) {
        this.map = Object.freeze(deepcopy(map));

        this.resolve = !mapConfig.resolve ? defaults.resolution : mapConfig.resolve;
        this.conflict = !mapConfig.conflict ? defaults.conflict : mapConfig.conflict;
        this.separateResolutionContexts = isNull(mapConfig.separateResolutionContexts) ? true : mapConfig.separateResolutionContexts;
        const trustResolverPermissions = isNull(mapConfig.trustResolverPermissions) ? false : mapConfig.trustResolverPermissions;
        this._resolveDirect = trustResolverPermissions ? resolvePermission : this.resolvePermissionDirectly.bind(this);
    }

    public getPermission(permission: Permission | string) {
        switch (typeof permission) {
        case "string":
            return this.map[permission];
        case "object":
            return this.map[permission.name];
        }
    }

    private _resolveDirect: (permission: Permission, permissions: Permissions<T>) => PermissionState;

    public resolvePermissionDirectly(permission: Permission, permissions: Permissions<T>): PermissionState {
        const actualPermission = this.getPermission(permission);
        if (isNull(actualPermission)) {
            throw new PermissionError(`Permission ${permission.name} does not exist`);
        }

        return resolvePermission(actualPermission, permissions);
    }

    /**
     * Check if a {@link Permissions} object has a specific permission according to this map.
     * @param permissionName - The permission to check.
     * @param permissions - The permissions object to get states from.
     * @param resolutionConfig - The resolution configuration to use. Defaults to the permission map's resolution configuration.
     * @returns Whether or not {@link permissions} have the specified permission ({@link permissionName}).
     */
    public hasPermission(
      permissionName: keyof T,
      permissions: Permissions<T>,
      resolutionConfig?: PermissionResolutionConfig
    ): boolean {
        const resolve = !resolutionConfig?.resolve ? this.resolve : resolutionConfig?.resolve;
        const conflict = !resolutionConfig?.conflict ? this.conflict : resolutionConfig?.conflict;

        // Resolution functions aren't allowed to access the permissions object directly
        // There's not really a good reason for this, unless the resolver is malicious,
        // in which case it could change the permissions object due to how JavaScript works
        // NOTE: The map itself is frozen
        const targetMap = this.separateResolutionContexts ? Object.freeze(deepcopy(this.map)) : this.map;

        return resolve(targetMap[permissionName], targetMap, (permission) => {
            return this._resolveDirect(permission, permissions);
        }, resolve, conflict).permitted;
    }

    public resolvePermissions(permissions: Permissions<T>, resolutionConfig?: PermissionResolutionConfig): ResolvedPermissions<T> {
        let perms: Partial<ResolvedPermissions<T>> = {};
        for (const permission of Object.values(this.map)) {
            perms[permission.name as keyof typeof perms] = this.hasPermission(permission.name, permissions, resolutionConfig);
        }
        return perms as ResolvedPermissions<T>;
    }
}
