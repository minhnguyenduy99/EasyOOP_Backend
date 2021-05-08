import {
    Controller,
    HttpCode,
    Post,
    UseInterceptors,
    Get,
} from "@nestjs/common";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import {
    AuthenticationService,
    AuthUserDecorator,
    AuthUserDto,
    TokenAuth,
} from "../core";

@Controller("auth")
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

    @Get("/info")
    @TokenAuth()
    @UseInterceptors(ResponseSerializerInterceptor)
    @Serialize(AuthUserDto)
    async getAuthInfo(
        @AuthUserDecorator("user", { serialize: true }) user: any,
    ) {
        return user;
    }
}
