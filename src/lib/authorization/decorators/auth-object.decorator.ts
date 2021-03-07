import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthObject = createParamDecorator((context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.authorization;
});
