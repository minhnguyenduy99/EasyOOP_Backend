import { BadRequestException, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { FACEBOOK_AUTH_CONFIG } from "./consts";
import { FacebookAppConfig, FacebookUser } from "./interfaces";

type DoneHandler = (err, user, info?: any) => void;

export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(
        @Inject(FACEBOOK_AUTH_CONFIG) facebookAppConfig: FacebookAppConfig,
    ) {
        super(facebookAppConfig);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: FacebookUser,
        done: DoneHandler,
    ) {
        const emails = profile?.emails;
        if (!emails || !emails?.length) {
            done(
                new BadRequestException({
                    error: "Missing email",
                }),
                null,
            );
        } else {
            done(null, profile);
        }
    }
}
