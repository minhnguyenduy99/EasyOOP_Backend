import { EntityPolicy } from "./entity-policy.model";
import { PrincipalPolicy } from "./principal-policy.model";
import { Principal } from "./principal.model";
import { RoleActionPolicy } from "./role-action-policy.model";
import { RolePolicy } from "./role-policy.model";
import { Role } from "./role.model";

export type PrincipalDTO = Partial<
    Pick<Principal, "principal_id" | "role_name">
>;

export type PrincipalPolicyDTO = Partial<
    Pick<PrincipalPolicy, "principal_id" | "action_name" | "resources">
>;

export type RoleDTO = Partial<Pick<Role, "role_name">>;

export type EntityPolicyDTO = Partial<
    Pick<
        EntityPolicy,
        "entity_name" | "policy_name" | "actions" | "isAllowedAll"
    >
>;

export interface RolePolicyDTO
    extends Partial<
        Pick<RolePolicy, "role_name" | "entity_name" | "entity_policy_names">
    > {
    entity_policies?: EntityPolicyDTO[];
}

export type RoleActionPolicyDTO = Partial<
    Pick<RoleActionPolicy, "role_name" | "entity_name" | "action_name">
>;
