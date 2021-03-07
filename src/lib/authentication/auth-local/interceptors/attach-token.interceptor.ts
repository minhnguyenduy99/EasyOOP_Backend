import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Response, Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthUserService } from "../auth-user.service";
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    REQUEST_TOKENS_KEY,
} from "../consts";
import { LocalAuthTokenValues } from "../local-auth.interfaces";

@Injectable()
export class AttachTokenInterceptor implements NestInterceptor {
    constructor(private readonly authUserService: AuthUserService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const res = context.switchToHttp().getResponse() as Response;
        const req = context.switchToHttp().getRequest() as Request;
        const authToken = await this.authUserService.findUserAuthToken(
            req["user"]["uid"],
        );
        return next.handle().pipe(
            map((data) => {
                const { accessToken, refreshToken } = req[
                    REQUEST_TOKENS_KEY
                ] as LocalAuthTokenValues;
                req.cookies[ACCESS_TOKEN_COOKIE] ??
                    this.setAccessTokenCookie(res, accessToken);
                req.cookies[REFRESH_TOKEN_COOKIE] ??
                    this.setRefreshTokenCookie(
                        res,
                        refreshToken,
                        new Date(authToken?.expired_in),
                    );
                return data;
            }),
        );
    }

    protected setAccessTokenCookie(res: Response, value) {
        if (!value) {
            res.clearCookie(ACCESS_TOKEN_COOKIE);
            return;
        }
        res.cookie(ACCESS_TOKEN_COOKIE, value, {
            httpOnly: true,
        });
    }

    protected setRefreshTokenCookie(res: Response, value, expiredIn: Date) {
        if (!value) {
            res.clearCookie(REFRESH_TOKEN_COOKIE);
            return;
        }
        console.log(expiredIn);
        res.cookie(REFRESH_TOKEN_COOKIE, value, {
            httpOnly: true,
            expires: expiredIn,
        });
    }
}
