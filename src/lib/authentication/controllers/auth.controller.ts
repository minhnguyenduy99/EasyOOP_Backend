import {
    Controller,
    HttpCode,
    Post,
    UseInterceptors,
    Get,
    BadRequestException,
    InternalServerErrorException,
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
    @Serialize(LoginResultDTO())
    async localLogin(@AuthUserDecorator() user: any) {
        const loginResult = await this.authService.logIn(user);
        if (loginResult.error) {
            throw new BadRequestException(loginResult);
        }
        return loginResult.data;
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
    @Serialize(LoginResultDTO())
    async reloginAsDefault(@AuthUserDecorator("user") user: any) {
        const loginResult = await this.authService.resetLoginStateToUser(user);
        if (loginResult.error) {
            throw new BadRequestException(loginResult);
        }
        return loginResult.data;
    }
}
