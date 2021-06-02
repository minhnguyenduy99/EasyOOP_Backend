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

@Injectable()
export class ClearAuthInfoInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                const res = context.switchToHttp().getResponse() as Response;
                res.clearCookie(REQUEST_KEYS.ACCESS_TOKEN_COOKIE);
                res.clearCookie(REQUEST_KEYS.REFRESH_TOKEN_COOKIE);
                res.clearCookie(REQUEST_KEYS.ROLE_COOKIE);
                return data;
            }),
        );
    }
}
