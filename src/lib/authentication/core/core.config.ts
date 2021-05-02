import { TokenConfig } from "./interfaces";

export const CONFIG_KEYS = {
    ACCESS_TOKEN_SECRET_KEY: "core.config.atsk",
    TOKEN_CONFIG: "core.config.token",
};

export default () => ({
    [CONFIG_KEYS.TOKEN_CONFIG]: {
        accessTokenSecretKey: process.env.AUTH_CORE_ACCESS_TOKEN_SECRET_KEY,
        accessTokenExpired: process.env.AUTH_CORE_ACCESS_TOKEN_EXPIRED,
        refreshTokenSecretKey: process.env.AUTH_CORE_REFRESH_TOKEN_SECRET_KEY,
        refreshTokenExpired: process.env.AUTH_CORE_REFRESH_TOKEN_EXPIRED,
    } as TokenConfig,
});
