import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { CONFIG_KEYS } from "../core.config";
import { AuthenticationService } from "../services";
import { AccessTokenExtractor } from "../utils";
import { AccessTokenPayload, TokenConfig } from "../interfaces";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    "jwt-access-token",
) {
    constructor(
        private authService: AuthenticationService,
        @Inject(CONFIG_KEYS.TOKEN_CONFIG) config: TokenConfig,
    ) {
        super({
            jwtFromRequest: AccessTokenExtractor,
            ignoreExpiration: false,
            secretOrKey: config.accessTokenSecretKey,
        });
    }

    async validate(payload: AccessTokenPayload) {
        const user = await this.authService.validateAccessTokenPayload(payload);
        if (!user) {
            throw new UnauthorizedException({
                error: "Access token is invalid",
            });
        }
        return user;
    }
}
