import { TokenExpiredError } from "jsonwebtoken";
import { Request } from "express";
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { LocalAuthService } from "../local-auth.service";
import { BaseLocalAuthGuard } from "./base-local-auth.guard";
import { AuthUserDTO } from "../dtos";
import { RefreshTokenExtractor } from "../token-extractors";

@Injectable()
export class RefreshableAccessTokenGuard extends BaseLocalAuthGuard(
    "jwt-access-token",
) {
    constructor(private readonly authService: LocalAuthService) {
        super();
    }

    async handleRequest(err, user, info, context: ExecutionContext) {
        if (user) {
            return user;
        }
        const authError =
            err ||
            new UnauthorizedException({
                error: "Invalid access token",
            });
        if (err || info) {
            if (
                !(err instanceof TokenExpiredError) &&
                !(info instanceof TokenExpiredError)
            ) {
                throw authError;
            }
        }
        const req = context.switchToHttp().getRequest() as Request;
        const refreshToken = RefreshTokenExtractor(req);
        if (!refreshToken) {
            throw new UnauthorizedException({
                error: "Missing refresh token",
            });
        }
        const validatedUser = await this.authService.validateRefreshToken(
            refreshToken,
        );
        if (!validatedUser) {
            throw new UnauthorizedException({
                error: "Invalid refresh token",
            });
        }
        const accessToken = await this.authService.generateAccessToken(
            validatedUser as AuthUserDTO,
        );
        validatedUser.accessToken = accessToken;
        return validatedUser;
    }
}
