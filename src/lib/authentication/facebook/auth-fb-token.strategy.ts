import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { use } from "passport";
import * as _FacebookTokenStrategy from "passport-facebook-token";
import { FACEBOOK_AUTH_CONFIG } from "./consts";
import { FacebookAppConfig, FacebookUser } from "./interfaces";

type DoneHandler = (err, user, info?: any) => void;

@Injectable()
export class FacebookTokenStrategy {
    constructor(
        @Inject(FACEBOOK_AUTH_CONFIG) facebookAppConfig: FacebookAppConfig,
    ) {
        this.init(facebookAppConfig);
    }

    init(appConfig: FacebookAppConfig) {
        use(
            new _FacebookTokenStrategy(
                {
                    clientID: appConfig.clientID,
                    clientSecret: appConfig.clientSecret,
                    fbGraphVersion: "v3.0",
                },
                this.validate,
            ),
        );
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: FacebookUser,
        done: DoneHandler,
    ) {
        console.log(accessToken);
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
