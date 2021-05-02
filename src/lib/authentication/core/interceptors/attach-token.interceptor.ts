import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Response, Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { REQUEST_KEYS } from "../consts";
import { AuthUser } from "../models";

@Injectable()
export class AttachTokenInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const res = context.switchToHttp().getResponse() as Response;
        const req = context.switchToHttp().getRequest() as Request;
        const user = req["user"] as AuthUser;
        return next.handle().pipe(
            map((data) => {
                const { accessToken, refreshToken } = req[
                    REQUEST_KEYS.AUTH_TOKEN
                ];
                const cookieRefreshToken =
                    req.cookies[REQUEST_KEYS.REFRESH_TOKEN_COOKIE];

                this.setAccessTokenCookie(res, accessToken);
                cookieRefreshToken ??
                    this.setRefreshTokenCookie(
                        res,
                        refreshToken,
                        new Date(user.token_expired),
                    );
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
