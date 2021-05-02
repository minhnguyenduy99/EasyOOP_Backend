import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { PROVIDERS } from "./consts";
import { GoogleAuthConfig } from "./interfaces";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(
        @Inject(PROVIDERS.GOOGLE_APP_CONFIG)
        googleAppConfig: GoogleAuthConfig,
    ) {
        super(googleAppConfig);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        if (!profile) {
            throw new UnauthorizedException();
        }
        done(null, profile);
    }
}
