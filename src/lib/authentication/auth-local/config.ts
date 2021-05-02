export const CONFIG_KEY = {
    accessTokenSecretKey: "atsk",
    accessTokenExpires: "atexp",
    refreshTokenSecretKey: "rtsk",
    refreshTokenExpires: "rtexp",
    rootUsername: "rootusername",
    rootPassword: "rootpassword",
};

export const LocalAuthConfigLoader = () => ({
    [CONFIG_KEY.accessTokenSecretKey]:
        process.env.LOCAL_AUTH_ACCESS_TOKEN_SECRET_KEY,
    [CONFIG_KEY.accessTokenExpires]: parseInt(
        process.env.LOCAL_AUTH_ACCESS_TOKEN_EXPIRES,
    ),
    [CONFIG_KEY.refreshTokenSecretKey]:
        process.env.LOCAL_AUTH_REFRESH_TOKEN_SECRET_KEY,
    [CONFIG_KEY.refreshTokenExpires]:
        process.env.LOCAL_AUTH_REFRESH_TOKEN_EXPIRES,
    [CONFIG_KEY.rootUsername]: process.env.LOCAL_AUTH_ROOT_USERNAME,
    [CONFIG_KEY.rootPassword]: process.env.LOCAL_AUTH_ROOT_PASSWORD,
});
