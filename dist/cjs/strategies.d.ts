import { type ConflictStrategy, coerceToFalse, coerceToTrue, prefer } from "permittere/strategies/conflict";
import { type ResolutionStrategy, direct, parentsOtherwiseChildren, explicitChildrenOverParents, explicitParentsOverChildren } from "permittere/strategies/resolution";
export declare type PermissionState = {
    permitted: boolean;
    coerced?: boolean;
    explicit: boolean;
};
export declare const defaults: {
    readonly conflict: ConflictStrategy;
    readonly resolution: ResolutionStrategy;
};
export { ConflictStrategy, coerceToFalse, coerceToTrue, prefer };
export { ResolutionStrategy, direct, parentsOtherwiseChildren, explicitChildrenOverParents, explicitParentsOverChildren };
