import {
    applyDecorators,
    SetMetadata,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { InjectRoleInterceptor } from "../interceptors/inject-role.interceptor";
import { RoleAuthorizationOptions, RoleUserOptions } from "../interfaces";
import { RoleAuthorizationGuard, USER_ROLE_OPTIONS_DECORATOR } from "../utils";

export const RoleAuthorization = (options?: RoleAuthorizationOptions) => {
    const { attachRole = true, getFullRoleInfo = false } = options ?? {};
    let decorators = [UseGuards(RoleAuthorizationGuard)];
    if (!attachRole) {
        return applyDecorators(...decorators);
    }
    const userRoleOptions = {
        fullInfo: getFullRoleInfo,
    } as RoleUserOptions;

    decorators.push(SetMetadata(USER_ROLE_OPTIONS_DECORATOR, userRoleOptions));
    decorators.push(UseInterceptors(InjectRoleInterceptor));

    return applyDecorators(...decorators);
};
