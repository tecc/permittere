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

import { PermissionName, permissions } from "./github";
import { Permissions, ManagedPermissionMap } from "permittere/permissions";

const managed = new ManagedPermissionMap(permissions);

test("Permissions", () => {
    const testData: Permissions<typeof permissions> = {
        [PermissionName.repository]: false,
        [PermissionName.repository_delete]: true
    };

    expect(managed.hasPermission(PermissionName.user, testData)).toEqual(
        permissions.user.default
    );
    expect(
        managed.hasPermission(PermissionName.repository_delete, testData)
    ).toEqual(testData[PermissionName.repository_delete]);
    expect(managed.hasPermission(PermissionName.repository, testData)).toEqual(
        testData[PermissionName.repository]
    );
});
