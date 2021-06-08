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
    AuthUserDto,
    LoginResultDTO,
    TokenAuth,
} from "src/lib/authentication/core";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { RoleDTO } from "../dtos";
import { ROLES } from "../modules/core";
import { RoleAuthenticationService } from "../modules/role-authentication";
import { ERRORS } from "../errors";

@Controller("role-authentication")
@UseInterceptors(ResponseSerializerInterceptor)
export class RoleAuthenticationController {
    constructor(private roleAuthentication: RoleAuthenticationService) {}

    @Post("/:type/login")
    @TokenAuth({
        isLogin: true,
    })
    @Serialize(LoginResultDTO(RoleDTO))
    async roleLogin(
        @Param("type") type: string,
        @AuthUserDecorator() authUser: AuthUserDto,
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
            case ROLES.admin:
                result = await this.roleAuthentication.loginAsRoot(authUser);
                break;
            default:
                throw new BadRequestException(ERRORS.InvalidRoleType);
        }
        if (result.error) {
            throw new ForbiddenException(result);
        }
        return result.data;
    }
}
