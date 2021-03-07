import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKENS_KEY } from "../consts";

export const LocalAuthTokens = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        return req[REQUEST_TOKENS_KEY];
    },
);
