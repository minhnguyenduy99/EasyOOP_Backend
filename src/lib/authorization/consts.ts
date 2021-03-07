export const MODULE_KEYS = {
    LOGGER: "LOGGER",
    RolePersistClass: "RolePersistClass",
    RolesData: "RolesData",
    AuthorizationDataPath: "ADP",
    PrincipalRepository: "PrincipalRepo",
    RolePolicyDefinitions: "RPDs",
    AuthFeatureOptions: "AFOs",
    TYPE: "TYPE",
    AuthDataHandler: "AuthDataHandler",
    HOOK: "HOOK",
};

export const PRINCIPAL_HEADER_FIELD = "qw-principal-id";

export const DECORATOR_ACTION = "action";
export const DECORATOR_ENTITY = "entity";
export const DECORATOR_RESOURCE_HANDLER = "resourceHandler";
export const DECORATOR_METHOD_TAG = "methodTag";

export const MethodTagValues = {
    Authorize: "authorize",
    Nonauthorize: "nonAuthorize",
};

export enum ModuleType {
    Root,
    Feature,
}

export type PolicyActionType = "resource" | "role";

export const ActionType = {
    resource: "resource" as PolicyActionType,
    role: "role" as PolicyActionType,
};
