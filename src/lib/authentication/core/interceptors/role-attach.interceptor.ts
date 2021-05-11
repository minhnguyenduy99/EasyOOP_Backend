import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Response, Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { REQUEST_KEYS } from "../consts";

export class AttachRoleInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const res = context.switchToHttp().getResponse() as Response;
        return next.handle().pipe(
            map((data) => {
                const { data: user } = data;
                if (!user?.role_id) {
                    return data;
                }
                res.cookie(REQUEST_KEYS.ROLE_COOKIE, user.role_id, {
                    httpOnly: true,
                });
                return data;
            }),
        );
    }
}
