import { FacebookAppConfig } from ".";
import {
    TransporterConfig,
    MailServiceConfig,
} from "../verifications/mail-verification";
import {
    FACEBOOK_AUTH_CONFIG,
    VERIFICATION_CONFIG,
    VERIFICATION_ENDPOINT,
} from "./consts";

export default () => ({
    [FACEBOOK_AUTH_CONFIG]: {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000",
        scope: "email",
    } as FacebookAppConfig,
    [VERIFICATION_CONFIG]: {
        transport: {
            host: process.env.FACEBOOK_VERIFY_HOST,
            port: parseInt(process.env.FACEBOOK_VERIFY_PORT),
            secure: false,
            auth: {
                user: process.env.FACEBOOK_VERIFY_USER,
                pass: process.env.FACEBOOK_VERIFY_PASSWORD,
            },
        } as TransporterConfig,
        mailConfig: {
            hostAddress: process.env.FACEBOOK_VERIFY_HOST_ADDRESS,
            defaultSubject: "EMAIL XÁC NHẬN",
        } as MailServiceConfig,
    },
    [VERIFICATION_ENDPOINT]: process.env.FACEBOOK_MAIL_VERIFICATION_ENDPOINT,
});
