import { FacebookAppConfig } from ".";
import { FACEBOOK_AUTH_CONFIG, VERIFICATION_ENDPOINT } from "./consts";

export default () => ({
    [FACEBOOK_AUTH_CONFIG]: {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        scope: "email",
    } as FacebookAppConfig,
    [VERIFICATION_ENDPOINT]: process.env.FACEBOOK_MAIL_VERIFICATION_ENDPOINT,
});
