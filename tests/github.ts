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

import { PermissionMap } from "permittere/permissions";

// Loosely based on GitHub
export enum PermissionName {
    user = "user",
    user_read = "user:read",
    user_modify = "user:modify",
    repository = "repository",
    repository_read = "repository:read",
    repository_create = "repository:create",
    repository_delete = "repository:delete"
}

export const permissions: PermissionMap<PermissionName> = {
    [PermissionName.user]: {
        name: PermissionName.user,
        default: false
    },
    [PermissionName.user_read]: {
        name: PermissionName.user_read,
        default: true
    },
    [PermissionName.user_modify]: {
        name: PermissionName.user_modify,
        default: false
    },
    [PermissionName.repository]: {
        name: PermissionName.repository,
        default: true
    },
    [PermissionName.repository_read]: {
        name: PermissionName.repository_read,
        default: true
    },
    [PermissionName.repository_create]: {
        name: PermissionName.repository_create,
        default: false
    },
    [PermissionName.repository_delete]: {
        name: PermissionName.repository_delete,
        default: false
    }
};
