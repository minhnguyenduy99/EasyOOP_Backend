import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { CONFIG_KEYS } from "../core.config";
import { ConfigService } from "@nestjs/config";
import { AuthenticationService } from "../services";
import { AccessTokenExtractor } from "../utils";
import { AccessTokenPayload } from "../interfaces";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    "jwt-access-token",
) {
    constructor(
        private authService: AuthenticationService,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: AccessTokenExtractor,
            ignoreExpiration: false,
            secretOrKey: configService.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET_KEY),
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
