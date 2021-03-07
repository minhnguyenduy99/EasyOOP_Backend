export class CreatePrincipalOptions {
    /**
     * The ID of principal
     */
    principal_id: string;

    /**
     * The name of role
     */
    role_name: string;

    /**
     * To choose to add the principal to its own principal policies
     */
    self_added?: boolean;
}

export class PrincipalPolicyKey {
    principal_id: string;
    entity_name: string;
    action_name?: string;
}

export class CreatePrincipalPolicyOptions extends PrincipalPolicyKey {
    resources?: string[];
}

export class CreateRoleActionPolicyOptions extends PrincipalPolicyKey {}

export interface RawAuthorizationData {
    roles?: RawRoleData[];
    rolePolicies?: RawRolePolicyDatas;
}

export interface RawRolePolicyDatas {
    [policyName: string]: RawRolePolicyData;
}

export interface RawRoleData {
    roleName: string;
    rolePolicies: string[];
}

export interface RawRolePolicyData {
    entityName: string;
    actions: string[];
}
