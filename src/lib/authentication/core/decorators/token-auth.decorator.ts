import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { AccessTokenGuard } from "../guards";
import { RefreshableAccessTokenGuard } from "../guards";
import {
    AttachAuthInfoInterceptor,
    ClearAuthInfoInterceptor,
    LoginAttachAuthInfoInterceptor,
    SetAuthInfoInterceptor,
} from "../interceptors";
export interface TokenAuthOptions {
    autoRefresh?: boolean;
    attachCookies?: boolean;
    /**
     * If `true`, the cookie result is retrieved from the return data of handler. If `false`, the result
     * is retrieved from previously injected tokens from request.
     */
    isLogin?: boolean;
}

export const TokenAuth = (options?: TokenAuthOptions) => {
    const { autoRefresh = true, attachCookies = true, isLogin = false } =
        options ?? {};
    const guard = autoRefresh ? RefreshableAccessTokenGuard : AccessTokenGuard;
    const interceptors = [SetAuthInfoInterceptor] as any[];
    if (attachCookies && autoRefresh) {
        if (isLogin) {
            interceptors.push(LoginAttachAuthInfoInterceptor);
        } else {
            interceptors.push(AttachAuthInfoInterceptor);
        }
    } else {
        interceptors.push(ClearAuthInfoInterceptor);
    }

    return applyDecorators(UseGuards(guard), UseInterceptors(...interceptors));
};
