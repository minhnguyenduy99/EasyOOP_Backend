import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { REQUEST_KEYS } from "../consts";
import { AuthUserDTO } from "../dtos";
import { AuthUser } from "../models";
import {
    AccessTokenExtractor,
    RefreshTokenExtractor,
    RoleIdExtractor,
} from "../utils";

export class SetRequestTokensInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest() as Request;
        const user = req["user"] as AuthUser;
        user.refreshToken = RefreshTokenExtractor(req);
        user.accessToken = user.accessToken ?? AccessTokenExtractor(req);
        user.role_id = user.role_id ?? RoleIdExtractor(req);
        req[REQUEST_KEYS.AUTH_TOKEN] = {
            accessToken: user?.accessToken,
            refreshToken: RefreshTokenExtractor(req),
        };
        return next.handle();
    }
}
