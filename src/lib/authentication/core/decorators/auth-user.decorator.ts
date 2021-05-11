import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RoleIdExtractor } from "../utils";

export interface AuthUserOptions {
    serialize?: boolean;
}

export const AuthUserDecorator = (
    field = "user",
    options?: AuthUserOptions,
) => {
    const { serialize = false } = options ?? {};
    const paramDecorator = createParamDecorator(
        (data: unknown, ctx: ExecutionContext) => {
            const req = ctx.switchToHttp().getRequest();
            if (!serialize) {
                return req[field];
            }
            return req[field]?.toObject() ?? req[field];
        },
    )();
    return paramDecorator;
};
