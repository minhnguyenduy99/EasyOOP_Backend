import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Put,
} from "@nestjs/common";
import { BodyValidationPipe, Serialize, UseFormData } from "src/lib/helpers";
import {
    AuthUser,
    AuthUserDecorator,
    AuthUserDto,
    GlobalAuthUserService,
    TokenAuth,
    UpdateAvatarDTO,
    UpdatePasswordDTO,
    UpdateProfileDTO,
} from "../core";

@Controller("/user")
@TokenAuth()
export class UserController {
    constructor(private userService: GlobalAuthUserService) {}

    @Put("/profile")
    async updateProfile(
        @AuthUserDecorator() user: AuthUser,
        @Body(new BodyValidationPipe()) profile: UpdateProfileDTO,
    ) {
        const result = await this.userService.updateProfile(
            user.user_id,
            profile,
        );
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Put("/update-password")
    async updatePassword(
        @AuthUserDecorator() user: AuthUser,
        @Body(new BodyValidationPipe()) dto: UpdatePasswordDTO,
    ) {
        const result = await this.userService.updatePassword(
            user.user_id,
            dto.password,
        );
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @UseFormData({ fileField: ["avatar"] })
    @Put("/avatar")
    async updateAvatar(
        @AuthUserDecorator() user: AuthUser,
        @Body() dto: UpdateAvatarDTO,
    ) {
        const result = await this.userService.updateAvatar(user, dto.avatar);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/info")
    @Serialize(AuthUserDto, true)
    async getUserInfo(@AuthUserDecorator() user: AuthUser) {
        return user;
    }
}
