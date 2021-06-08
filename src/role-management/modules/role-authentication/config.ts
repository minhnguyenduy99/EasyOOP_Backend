import { CoreAuthenticationConfig } from "./interfaces";

export const CONFIG_KEYS = {
    ROOT_ID: "RoleAuthentication.ROOT_ID",
    MODULE_CONFIG: "RoleAuthentication.MODULE_CONFIG",
};

export const configLoader = () => ({
    [CONFIG_KEYS.ROOT_ID]: process.env.ROLE_AUTHENTICATION_ROOT_ID,
    [CONFIG_KEYS.MODULE_CONFIG]: {
        rootRoleID: process.env.ROLE_AUTHENTICATION_ROOT_ID,
    } as CoreAuthenticationConfig,
});
