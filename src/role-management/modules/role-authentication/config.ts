export const CONFIG_KEYS = {
    ADMIN_ROLE_ID: "RoleAuthentication.AdminRoleID",
};

export const loader = () => ({
    [CONFIG_KEYS.ADMIN_ROLE_ID]: process.env.ROLE_AUTHENTICATION_ADMIN_ROLE_ID,
});
