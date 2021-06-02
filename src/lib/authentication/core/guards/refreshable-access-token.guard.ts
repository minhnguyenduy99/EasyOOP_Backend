import { TokenExpiredError } from "jsonwebtoken";
import { Request } from "express";
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthenticationService } from "../services";
import { BaseAuthGuard } from "./base-auth.guard";
import { InjectAccessToken, RefreshTokenExtractor } from "../utils";

@Injectable()
export class RefreshableAccessTokenGuard extends BaseAuthGuard(
    "jwt-access-token",
) {
    constructor(private readonly authService: AuthenticationService) {
        super();
    }

    async handleRequest(err, user, info, context: ExecutionContext) {
        if (user) {
            return user;
        }
        // The access token is available but invalid
        if (!this.isNoAuthTokenError(info)) {
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
        }
        const req = context.switchToHttp().getRequest() as Request;
        const validatedUser = await this.validateRefreshToken(req);
        const accessToken = await this.authService.generateAccessToken(
            validatedUser,
        );
        // inject access token to header
        InjectAccessToken(req, accessToken);
        return validatedUser;
    }

    protected async validateRefreshToken(req: Request) {
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
        return validatedUser;
    }

    protected isNoAuthTokenError(error) {
        return error?.message?.toLowerCase() === "no auth token";
    }
}
