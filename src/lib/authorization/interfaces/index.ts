export * from "./auth-core-root-options";
export { EntityPolicyDefinition } from "./entity-policy-definition";
export { RolePolicyAssign } from "./role-policy-assign";
export { AuthFeatureOptions, AuthFeatureConfig } from "./auth-feature-options";
export { IAuthorizationService } from "./authorization-service";
export { AuthDataHandler, AuthData } from "./auth-data-handler";
export * from "./authorization-hooks";
export * from "./auth-metadata";

import { RawAuthorizationData } from "../dto";

export interface IAuthorizationDataPersist {
    persistRolesAndPolicies(
        rawData: RawAuthorizationData,
    ): void | Promise<void>;

    persistPrincipalsAndPrincipalPolicies(principals: string[]);
}
