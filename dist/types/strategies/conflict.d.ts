import { PermissionState } from "permittere/strategies";
export declare type ConflictStrategy = (states: PermissionState[]) => PermissionState;
export declare const coerceToFalse: ConflictStrategy;
export declare const coerceToTrue: ConflictStrategy;
export declare function prefer(explicit: boolean, fallback: ConflictStrategy): ConflictStrategy;
