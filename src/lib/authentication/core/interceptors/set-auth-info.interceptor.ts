import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthUser } from "../models";
import { AccessTokenExtractor, SetAuthInfo } from "../utils";

export class SetAuthInfoInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest() as Request;
        const user = req["user"] as AuthUser;
        if (!user) {
            return next.handle();
        }
        const accessToken = AccessTokenExtractor(req);
        SetAuthInfo(req, { accessToken, roleId: user.role_id });
        return next.handle();
    }
}
