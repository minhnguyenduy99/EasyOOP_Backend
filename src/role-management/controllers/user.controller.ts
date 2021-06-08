import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { GlobalAuthUserService } from "src/lib/authentication";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { SearchUserDTO } from "../dtos";
import { ERRORS } from "../errors";

@Controller("users")
@UseInterceptors(ResponseSerializerInterceptor)
export class UserController {
    constructor(private userService: GlobalAuthUserService) {}

    @Get("/search/:user_id")
    @Serialize(SearchUserDTO)
    async searchUserById(@Param("user_id") userId: string) {
        const user = await this.userService.getUserById(userId);
        if (!user || !user?.is_active) {
            throw new NotFoundException(ERRORS.UserNotFound);
        }
        return user;
    }
}
