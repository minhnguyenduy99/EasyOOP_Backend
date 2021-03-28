import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { AccessTokenGuard } from "../guards";
import { RefreshableAccessTokenGuard } from "../guards";
import {
    AttachTokenInterceptor,
    ClearTokenCookieInterceptor,
    SetRequestTokensInterceptor,
} from "../interceptors";

export interface TokenAuthOptions {
    autoRefresh?: boolean;
    attachCookies?: boolean;
}

export const TokenAuth = (options?: TokenAuthOptions) => {
    const { autoRefresh = true, attachCookies = true } = options ?? {};
    const guard = autoRefresh ? RefreshableAccessTokenGuard : AccessTokenGuard;
    const interceptors = [SetRequestTokensInterceptor] as any[];
    if (attachCookies && autoRefresh) {
        interceptors.push(AttachTokenInterceptor);
    } else {
        interceptors.push(ClearTokenCookieInterceptor);
    }

    return applyDecorators(UseGuards(guard), UseInterceptors(...interceptors));
};
