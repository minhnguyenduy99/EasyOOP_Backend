import { RolePolicyAssign } from "./role-policy-assign";
import { EntityPolicyDefinition } from "./entity-policy-definition";

export interface AuthFeatureOptions {
    /**
     * Authorization config to apply
     */
    config?: AuthFeatureConfig;
}

export interface AuthFeatureConfig {
    /**
     * Define list of entity policies
     */
    policies: EntityPolicyDefinition[];

    /**
     * Define policy assignments for roles
     */
    assigns: RolePolicyAssign;
}
