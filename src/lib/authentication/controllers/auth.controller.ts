import {
    Controller,
    HttpCode,
    Post,
    UseInterceptors,
    Get,
    BadRequestException,
} from "@nestjs/common";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { CommonResponse } from "src/lib/types";
import {
    AuthenticationService,
    AuthUserDecorator,
    AuthUserDto,
    LoginResultDTO,
    TokenAuth,
} from "../core";

@Controller("auth")
@UseInterceptors(ResponseSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthenticationService) {}

    @TokenAuth({
        attachCookies: false,
    })
    @HttpCode(200)
    @Post("/logout")
    logOut(@AuthUserDecorator() user: any) {
        this.authService.logOut(user);
    }

    @Post("/relogin")
    @TokenAuth()
    @Serialize(CommonResponse(AuthUserDto))
    async reloginAsDefault(@AuthUserDecorator("user") user: any) {
        const validatedUser = await this.authService.resetLoginStateToUser(
            user,
        );
        if (!validatedUser) {
            throw new BadRequestException();
        }
        return {
            code: 0,
            data: validatedUser,
        };
    }
}
