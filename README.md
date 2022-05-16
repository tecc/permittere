# permittere 
[![npm](https://img.shields.io/npm/v/permittere?label=latest&style=flat-square)](https://npmjs.com/package/permittere) 
[![development branch](https://img.shields.io/github/package-json/v/tecc/permittere?label=development%20branch&style=flat-square)](https://github.com/tecc/permittere) 

permittere is a simple permissions library. Note that this library is new and could use feature ideas.

The word `permittere` comes from Latin, meaning roughly "allow", "grant", or "permit" ([see here](https://en.wiktionary.org/wiki/permitto#Latin)).

## Usage

There's not much documentation on how to use it right now.
There's this example, but for the details you'll have to skim the code (there is documentation to help with it).

```js
const { ManagedPermissionMap } = require("permittere");

const map = new ManagedPermissionMap({
    'myParentPermission': {
        name: 'myParentPermission', // I know that that is slightly redundant but that's fine for now
        default: true
    },
    'myChildPermission': {
        name: 'myChildPermission',
        default: false,
        parents: ['myParentPermission'] // Because this has a parent permission, the value of this permission will only matter if it was set directly (i.e. the entity explicitly has this permission)
    }
});

/* Some examples with this map */
map.hasPermission('myParentPermission', {}) // (1) true; the entity has no explicit permissions so it uses the default
map.hasPermission('myParentPermission', { 'myParentPermission': false }) // (2) false; the entity explicitly does not have myParentPermission
map.hasPermission('myParentPermission', { 'myChildPermission': false }) // (3) true; children of a permission do not affect the parent
map.hasPermission('myChildPermission', {}) // (4) true; the parent permission is true which takes priority
map.hasPermission('myChildPermission', { 'myChildPermission': false }) // (5) false; myChildPermission is explicitly set to false, which takes priority
map.hasPermission('myChildPermission', { 'myParentPermission': false, 'myChildPermission': true }) // (6); as with case 5, an explicitly set permission takes priority
```

## Licence

```
Copyright 2022 tecc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
