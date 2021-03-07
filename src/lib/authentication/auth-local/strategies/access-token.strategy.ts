import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { LocalAuthService } from "../local-auth.service";
import { CONFIG_KEY } from "../config";
import { AccessTokenPayload } from "../local-auth.interfaces";
import { ConfigService } from "@nestjs/config";
import { AccessTokenInvalid } from "../errors";
import { AccessTokenExtractor } from "../token-extractors";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    "jwt-access-token",
) {
    constructor(
        private localAuthService: LocalAuthService,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: AccessTokenExtractor,
            ignoreExpiration: false,
            secretOrKey: configService.get(CONFIG_KEY.accessTokenSecretKey),
        });
    }

    async validate(payload: AccessTokenPayload) {
        const user = await this.localAuthService.validateAccessTokenPayload(
            payload,
        );
        if (!user) {
            throw new AccessTokenInvalid();
        }
        return user;
    }
}
