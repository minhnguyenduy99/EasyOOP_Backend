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
    LocalAuth,
    LoginResultDTO,
    TokenAuth,
} from "../core";

@Controller("auth")
@UseInterceptors(ResponseSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthenticationService) {}

    @LocalAuth()
    @Post("/login/local")
    @Serialize(CommonResponse(AuthUserDto))
    localLogin(@AuthUserDecorator() user: any) {
        return {
            code: 0,
            data: user,
        };
    }

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
