import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUserDTO } from "../dtos";

export interface AuthUserOptions {
    serialize?: boolean;
}

export const AuthUser = (field = "user", options?: AuthUserOptions) => {
    const _opts = options ?? {
        serialize: false,
    };
    const paramDecorator = createParamDecorator(
        (data: unknown, ctx: ExecutionContext) => {
            const req = ctx.switchToHttp().getRequest();
            return req[field];
        },
    )();
    return paramDecorator;
};
