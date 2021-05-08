import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RoleUserData } from "../dtos";
import { USER_ROLE_KEY } from "../utils";

export const RoleUser = () => {
    return createParamDecorator((data, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const roleUser = req[USER_ROLE_KEY] as RoleUserData;
        return roleUser;
    })();
};
