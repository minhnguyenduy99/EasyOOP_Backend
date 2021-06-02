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
import { AccessTokenExtractor, RefreshTokenExtractor } from "../utils";

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
                // const accessToken = user.accessToken;
                // const refreshToken = user.refreshToken;

                // this.setAccessTokenCookie(res, req, accessToken);
                // this.setRefreshTokenCookie(
                //     res,
                //     req,
                //     refreshToken,
                //     new Date(user.token_expired),
                // );

                return data;
            }),
        );
    }

    protected setAccessTokenCookie(res: Response, req: Request, value: string) {
        const previousAccessToken = AccessTokenExtractor(req);
        if (!previousAccessToken || previousAccessToken !== value) {
            res.cookie(REQUEST_KEYS.ACCESS_TOKEN_COOKIE, value, {
                httpOnly: false,
                maxAge: 5 * 60 * 1000,
            });
            return;
        }
    }

    protected setRefreshTokenCookie(
        res: Response,
        req: Request,
        value: string,
        expiredIn: Date,
    ) {
        const previousRefreshToken = RefreshTokenExtractor(req);
        if (!previousRefreshToken || previousRefreshToken !== value) {
            res.cookie(REQUEST_KEYS.REFRESH_TOKEN_COOKIE, value, {
                httpOnly: true,
                expires: expiredIn,
            });
            return;
        }
    }
}
