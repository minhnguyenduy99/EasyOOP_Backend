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
                const { data: user } = data;
                this.setAccessTokenCookie(res, user.accessToken);
                this.setRefreshTokenCookie(
                    res,
                    user.refreshToken,
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
        });
    }

    protected setRefreshTokenCookie(res: any, value, expiredIn: Date) {
        res.cookie(REQUEST_KEYS.REFRESH_TOKEN_COOKIE, value, {
            httpOnly: true,
            expires: expiredIn,
        });
    }
}
