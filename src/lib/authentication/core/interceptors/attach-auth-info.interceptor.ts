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
import { AccessTokenExtractor, GetAuthInfo } from "../utils";

@Injectable()
export class AttachAuthInfoInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const res = context.switchToHttp().getResponse() as Response;
        const req = context.switchToHttp().getRequest() as Request;
        const authInfo = GetAuthInfo(req);
        return next.handle().pipe(
            map((data) => {
                this.setAccessTokenCookie(res, authInfo.accessToken);
                return data;
            }),
        );
    }

    protected setAccessTokenCookie(res: Response, value: string) {
        res.cookie(REQUEST_KEYS.ACCESS_TOKEN_COOKIE, value, {
            httpOnly: false,
            maxAge: 5 * 60 * 1000,
            secure: true,
        });
    }

    protected setRoleIDCookie(res: Response, value: string) {
        res.cookie(REQUEST_KEYS.ROLE_COOKIE, value, {
            httpOnly: true,
            secure: true,
        });
        return;
    }
}
