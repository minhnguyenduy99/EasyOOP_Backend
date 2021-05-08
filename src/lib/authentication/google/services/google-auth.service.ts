import { Inject, Injectable, Logger } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { CONFIG_KEYS } from "../google.config";
import { GoogleAuthConfig, GoogleUser } from "../interfaces";

@Injectable()
export class GoogleAuthService {
    protected auth: OAuth2Client;

    constructor(
        @Inject(CONFIG_KEYS.GOOGLE_APP_CONFIG)
        protected apiConfig: GoogleAuthConfig,
        protected logger: Logger,
    ) {
        const { clientID, clientSecret, callbackURL } = apiConfig;
        this.auth = new OAuth2Client(clientID, clientSecret, callbackURL);
    }

    async verifyIdToken(token: string) {
        try {
            const result = await this.auth.verifyIdToken({ idToken: token });
            const payload = result.getPayload();
            return {
                id: payload.sub,
                ...payload,
            } as GoogleUser;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}
