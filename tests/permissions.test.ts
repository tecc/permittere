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

let ITERATIONS = 1000;

function _test(managed: ManagedPermissionMap, output: boolean = true) {
    const testData: Permissions<typeof permissions> = {
        [PermissionName.repository]: false,
        [PermissionName.repository_delete]: true
    };

    const it = ITERATIONS;
    const start = process.hrtime.bigint();
    for (let iteration = 0; iteration < it; iteration++) {
        // Iterations are good for measurements
        expect(managed.hasPermission(PermissionName.user, testData)).toEqual(
          permissions.user.default
        );
        expect(
          managed.hasPermission(PermissionName.repository_delete, testData)
        ).toEqual(testData[PermissionName.repository_delete]);
        expect(managed.hasPermission(PermissionName.repository, testData)).toEqual(
          testData[PermissionName.repository]
        );
    }
    const unit = "µs";
    const time = Number(process.hrtime.bigint() - start) / 1000;
    const average = time / it;
    output ? console.log("Speed of test \"%s\" (%s iterations): %s%s (%s%s average)",
      expect.getState().currentTestName, it,
      time.toFixed(3), unit, average.toFixed(3), unit
    ) : null;
}

test("Warmup (Default)", () => {
    const managed = new ManagedPermissionMap(permissions);

    _test(managed, false);
    ITERATIONS = 400;
})

test("Single context, trusted resolvers", () => {
    const managed = new ManagedPermissionMap(permissions, {
        separateResolutionContexts: false,
        trustResolverPermissions: true
    });

    _test(managed);
})

test("Single context, untrusted resolvers", () => {
    const managed = new ManagedPermissionMap(permissions, {
        separateResolutionContexts: false,
        trustResolverPermissions: false
    })

    _test(managed);
})

test("Separate contexts, trusted resolvers", () => {
    const managed = new ManagedPermissionMap(permissions, {
        separateResolutionContexts: true,
        trustResolverPermissions: true
    });

    _test(managed);
})

test("Separate contexts, untrusted resolvers", () => {
    const managed = new ManagedPermissionMap(permissions, {
        separateResolutionContexts: true,
        trustResolverPermissions: false
    });

    _test(managed);
});
