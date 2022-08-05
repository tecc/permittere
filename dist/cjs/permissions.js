"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedPermissionMap = exports.resolvePermission = exports.getParents = exports.hasParent = void 0;
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
const util_1 = require("permittere/util");
const strategies_1 = require("permittere/strategies");
const rfdc_1 = __importDefault(require("rfdc"));
/**
 * Check if a permission has any parents (i.e. one or more parents).
 * @param permission - The permission to check the parents of.
 * @returns Whether or not the permission has any parents.
 */
function hasParent(permission) {
    if (!(0, util_1.isNull)(permission.parent)) {
        return true;
    }
    return (0, util_1.isArray)(permission.parents) && permission.parents.length > 0;
}
exports.hasParent = hasParent;
function getParents(permission) {
    if (!hasParent(permission))
        return [];
    const sum = [];
    if ((0, util_1.isString)(permission.parent)) {
        sum.push(permission.parent);
    }
    if ((0, util_1.isArray)(permission.parents) && permission.parents.length > 0) {
        sum.push(...permission.parents);
    }
    return sum;
}
exports.getParents = getParents;
function resolvePermission(permission, permissions) {
    const value = permissions[permission.name];
    if ((0, util_1.isNull)(value)) {
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
exports.resolvePermission = resolvePermission;
const deepcopy = (0, rfdc_1.default)({
    circles: false,
    proto: true
});
/**
 * A managed permission map.
 * Essentially wraps around a {@link PermissionMap} with a few useful utilities.
 */
class ManagedPermissionMap {
    /**
     * Create a new permission map.
     * @param map - The underlying map
     * @param mapConfig - The configuration for the map.
     */
    constructor(map, mapConfig = {}) {
        this.map = Object.freeze(deepcopy(map));
        this.resolve = !mapConfig.resolve ? strategies_1.defaults.resolution : mapConfig.resolve;
        this.conflict = !mapConfig.conflict ? strategies_1.defaults.conflict : mapConfig.conflict;
        this.separateResolutionContexts = (0, util_1.isNull)(mapConfig.separateResolutionContexts) ? true : mapConfig.separateResolutionContexts;
        const trustResolverPermissions = (0, util_1.isNull)(mapConfig.trustResolverPermissions) ? false : mapConfig.trustResolverPermissions;
        this._resolveDirect = trustResolverPermissions ? resolvePermission : this.resolvePermissionDirectly.bind(this);
    }
    getPermission(permission) {
        switch (typeof permission) {
            case "string":
                return this.map[permission];
            case "object":
                return this.map[permission.name];
        }
    }
    resolvePermissionDirectly(permission, permissions) {
        const actualPermission = this.getPermission(permission);
        if ((0, util_1.isNull)(actualPermission)) {
            throw new util_1.PermissionError(`Permission ${permission.name} does not exist`);
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
    hasPermission(permissionName, permissions, resolutionConfig) {
        const resolve = !(resolutionConfig === null || resolutionConfig === void 0 ? void 0 : resolutionConfig.resolve) ? this.resolve : resolutionConfig === null || resolutionConfig === void 0 ? void 0 : resolutionConfig.resolve;
        const conflict = !(resolutionConfig === null || resolutionConfig === void 0 ? void 0 : resolutionConfig.conflict) ? this.conflict : resolutionConfig === null || resolutionConfig === void 0 ? void 0 : resolutionConfig.conflict;
        // Resolution functions aren't allowed to access the permissions object directly
        // There's not really a good reason for this, unless the resolver is malicious,
        // in which case it could change the permissions object due to how JavaScript works
        // NOTE: The map itself is frozen
        const targetMap = this.separateResolutionContexts ? Object.freeze(deepcopy(this.map)) : this.map;
        return resolve(targetMap[permissionName], targetMap, (permission) => {
            return this._resolveDirect(permission, permissions);
        }, resolve, conflict).permitted;
    }
    resolvePermissions(permissions, resolutionConfig) {
        let perms = {};
        for (const permission of Object.values(this.map)) {
            perms[permission.name] = this.hasPermission(permission.name, permissions, resolutionConfig);
        }
        return perms;
    }
}
exports.ManagedPermissionMap = ManagedPermissionMap;
//# sourceMappingURL=permissions.js.map