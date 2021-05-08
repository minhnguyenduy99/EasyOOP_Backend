export interface RoleUserOptions {
    /**
     * Get full info of role instead of just user_id and role_id. Default is false
     */
    fullInfo?: boolean;
}

export interface RoleAuthorizationOptions {
    /**
     * Weither to attach the role to the request, which can after be retrieved using @RoleUser decorator
     * Default is true
     */
    attachRole?: boolean;

    /**
     * Get full info of role instead of just user_id and role_id. Default is false
     */
    getFullRoleInfo?: boolean;
}
