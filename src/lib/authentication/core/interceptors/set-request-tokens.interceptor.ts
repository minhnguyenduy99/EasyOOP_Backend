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
import { AccessTokenExtractor, RefreshTokenExtractor } from "../utils";

export class SetRequestTokensInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest() as Request;
        const user = req["user"] as AuthUserDTO;
        req[REQUEST_KEYS.AUTH_TOKEN] = {
            accessToken: AccessTokenExtractor(req) ?? user?.accessToken,
            refreshToken: RefreshTokenExtractor(req),
        };
        return next.handle();
    }
}
