import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { REQUEST_KEYS } from "../consts";
import { LoginResult } from "../interfaces";

export class LoginAttachAuthInfoInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const res = context.switchToHttp().getResponse() as Response;
        return next.handle().pipe(
            map((data) => {
                const { user, accessToken, refreshToken } = data as LoginResult;
                this.setAccessTokenCookie(res, accessToken);
                this.setRefreshTokenCookie(
                    res,
                    refreshToken,
                    new Date(user.token_expired),
                );
                user.role_id &&
                    this.setRoleIDCookie(
                        res,
                        user.role_id,
                        new Date(user.token_expired),
                    );
                return data;
            }),
        );
    }

    protected setAccessTokenCookie(res: Response, value) {
        res.cookie(REQUEST_KEYS.ACCESS_TOKEN_COOKIE, value, {
            httpOnly: false,
            maxAge: 5 * 60 * 1000,
            sameSite: "none",
            secure: true,
            domain: process.env.COOKIE_DOMAIN,
        });
    }

    protected setRefreshTokenCookie(res: any, value, expiredIn: Date) {
        res.cookie(REQUEST_KEYS.REFRESH_TOKEN_COOKIE, value, {
            httpOnly: true,
            expires: expiredIn,
            sameSite: "none",
            secure: true,
            domain: process.env.COOKIE_DOMAIN,
        });
    }

    protected setRoleIDCookie(res: Response, value: string, expiredIn: Date) {
        res.cookie(REQUEST_KEYS.ROLE_COOKIE, value, {
            httpOnly: true,
            expires: expiredIn,
            sameSite: "none",
            secure: true,
            domain: process.env.COOKIE_DOMAIN,
        });
        return;
    }
}
