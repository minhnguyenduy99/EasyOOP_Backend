import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { REQUEST_TOKENS_KEY } from "../consts";
import { AuthUserDTO } from "../dtos";
import { LocalAuthTokenValues } from "../local-auth.interfaces";
import {
    AccessTokenExtractor,
    RefreshTokenExtractor,
} from "../token-extractors";

@Injectable()
export class SetRequestTokensInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest() as Request;
        const user = req["user"] as AuthUserDTO;
        req[REQUEST_TOKENS_KEY] = {
            accessToken: AccessTokenExtractor(req) ?? user?.accessToken,
            refreshToken: RefreshTokenExtractor(req),
        } as LocalAuthTokenValues;
        return next.handle();
    }
}
