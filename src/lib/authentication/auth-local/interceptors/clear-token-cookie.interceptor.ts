import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../consts";

@Injectable()
export class ClearTokenCookieInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                const res = context.switchToHttp().getResponse() as Response;
                res.clearCookie(ACCESS_TOKEN_COOKIE);
                res.clearCookie(REFRESH_TOKEN_COOKIE);
                return data;
            }),
        );
    }
}
