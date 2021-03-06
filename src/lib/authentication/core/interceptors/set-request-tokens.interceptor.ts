import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { AccessTokenExtractor, SetAuthInfo } from "../utils";

export class SetRequestTokensInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest() as Request;
        const accessToken = AccessTokenExtractor(req);
        SetAuthInfo(req, { accessToken });
        return next.handle();
    }
}
