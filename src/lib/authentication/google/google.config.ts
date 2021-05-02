import { GoogleAuthConfig } from "./interfaces";

export const CONFIG_KEYS = {
    GOOGLE_APP_CONFIG: "auth.google.config",
};

export const ConfigLoader = () => ({
    [CONFIG_KEYS.GOOGLE_APP_CONFIG]: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_AUTH_REDIRECT,
        scope: ["email", "profile"],
    } as GoogleAuthConfig,
});
