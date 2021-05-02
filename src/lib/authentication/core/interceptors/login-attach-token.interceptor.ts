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

export class LoginAttachTokenInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const res = context.switchToHttp().getResponse() as Response;
        return next.handle().pipe(
            map((data) => {
                const {
                    data: { user, accessToken, refreshToken },
                } = data;
                if (accessToken) {
                    this.setAccessTokenCookie(res, accessToken);
                }
                if (refreshToken) {
                    this.setRefreshTokenCookie(
                        res,
                        refreshToken,
                        new Date(user.token_expired),
                    );
                }
                return data;
            }),
        );
    }

    protected setAccessTokenCookie(res: any, value) {
        res.cookie(REQUEST_KEYS.ACCESS_TOKEN_COOKIE, value, {
            httpOnly: true,
        });
    }

    protected setRefreshTokenCookie(res: any, value, expiredIn: Date) {
        res.cookie(REQUEST_KEYS.REFRESH_TOKEN_COOKIE, value, {
            httpOnly: true,
            expires: expiredIn,
        });
    }
}
