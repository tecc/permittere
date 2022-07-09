/*[object Object]*/
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.test.json");

/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: [ "<rootDir>" ],
    testPathIgnorePatterns: [ "node_modules" ],
    testMatch: [ "**/?(*.)+(test).[tj]s" ],
    modulePaths: [ "<rootDir>" ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>"
    }),
    globals: {
        "ts-jest": {
            tsconfig: compilerOptions
        }
    }
};
