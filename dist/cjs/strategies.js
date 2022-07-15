"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.explicitParentsOverChildren = exports.explicitChildrenOverParents = exports.parentsOtherwiseChildren = exports.direct = exports.prefer = exports.coerceToTrue = exports.coerceToFalse = exports.defaults = void 0;
const conflict_1 = require("permittere/strategies/conflict");
Object.defineProperty(exports, "coerceToFalse", { enumerable: true, get: function () { return conflict_1.coerceToFalse; } });
Object.defineProperty(exports, "coerceToTrue", { enumerable: true, get: function () { return conflict_1.coerceToTrue; } });
Object.defineProperty(exports, "prefer", { enumerable: true, get: function () { return conflict_1.prefer; } });
const resolution_1 = require("permittere/strategies/resolution");
Object.defineProperty(exports, "direct", { enumerable: true, get: function () { return resolution_1.direct; } });
Object.defineProperty(exports, "parentsOtherwiseChildren", { enumerable: true, get: function () { return resolution_1.parentsOtherwiseChildren; } });
Object.defineProperty(exports, "explicitChildrenOverParents", { enumerable: true, get: function () { return resolution_1.explicitChildrenOverParents; } });
Object.defineProperty(exports, "explicitParentsOverChildren", { enumerable: true, get: function () { return resolution_1.explicitParentsOverChildren; } });
exports.defaults = {
    conflict: (0, conflict_1.prefer)(true, conflict_1.coerceToFalse),
    resolution: (0, resolution_1.explicitChildrenOverParents)()
};
//# sourceMappingURL=strategies.js.map