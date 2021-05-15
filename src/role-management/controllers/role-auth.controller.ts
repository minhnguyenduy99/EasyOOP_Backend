import {
    BadRequestException,
    Controller,
    ForbiddenException,
    Param,
    Post,
    UseInterceptors,
} from "@nestjs/common";
import {
    AuthUserDecorator,
    AuthUserDTO,
    LoginResultDTO,
    TokenAuth,
} from "src/lib/authentication/core";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { CommonResponse } from "src/lib/types";
import { RoleDTO } from "../dtos";
import { ROLES, ERRORS } from "../modules/core";
import { RoleAuthenticationService } from "../modules/role-authentication";

@Controller("role-authentication")
@UseInterceptors(ResponseSerializerInterceptor)
export class RoleAuthenticationController {
    constructor(private roleAuthentication: RoleAuthenticationService) {}

    @Post("/:type/login")
    @TokenAuth({
        isLogin: true,
    })
    @Serialize(CommonResponse(RoleDTO))
    async roleLogin(
        @Param("type") type: string,
        @AuthUserDecorator() authUser: AuthUserDTO,
    ) {
        const userId = authUser.user_id;
        let result;
        switch (type) {
            case ROLES.creator:
                result = await this.roleAuthentication.loginAsCreator(userId);
                break;
            case ROLES.manager:
                result = await this.roleAuthentication.loginAsManager(userId);
                break;
            case ROLES.viewer:
                result = await this.roleAuthentication.loginAsViewer(userId);
                break;
            default:
                throw new BadRequestException({
                    error: "Invalid role type",
                });
        }
        if (result.error) {
            throw new ForbiddenException(result);
        }
        return result;
    }
}
