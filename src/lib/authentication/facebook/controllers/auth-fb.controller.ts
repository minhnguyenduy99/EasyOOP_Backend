import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { CommonResponse } from "src/lib/types";
import {
    AuthenticationService,
    AuthUserDto,
    GlobalAuthUserService,
    LoginAttachAuthInfoInterceptor,
    LoginResultDTO,
} from "../../core";
import { FacebookTokenGuard } from "../auth-fb-token.guard";
import { FacebookGuard } from "../auth-fb.guard";
import { FacebookUserService } from "../auth-fb.service";
import { FacebookUser } from "../interfaces";

@Controller("/auth/facebook")
@UseInterceptors(ResponseSerializerInterceptor)
export class FacebookAuthController {
    constructor(
        private readonly fbAuthService: FacebookUserService,
        private userService: GlobalAuthUserService,
        private authService: AuthenticationService,
    ) {}

    @Get("/login")
    @UseGuards(FacebookGuard)
    async loginFacebook() {
        return HttpStatus.OK;
    }

    @Get("/redirect")
    @UseGuards(FacebookGuard)
    @Serialize(LoginResultDTO())
    @UseInterceptors(LoginAttachAuthInfoInterceptor)
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        const fbUser = req["user"] as FacebookUser;
        let user = await this.userService.getUserById(fbUser.id);
        if (!user) {
            const result = await this.fbAuthService.createUser(fbUser);
            if (result.error) {
                throw new BadRequestException({ error: result.error });
            }
            user = result.data;
        }
        const loginResult = await this.authService.logIn(
            user,
            this.userService.getDefaultRole(),
        );
        if (loginResult.error) {
            throw new BadRequestException(loginResult);
        }
        return loginResult.data;
    }

    @Get("/login-with-token")
    @UseGuards(FacebookTokenGuard)
    @UseInterceptors(LoginAttachAuthInfoInterceptor)
    @Serialize(LoginResultDTO())
    async loginWithFacebookToken(@Req() req: Request) {
        const fbUser = req["user"] as FacebookUser;
        let user = await this.userService.getUserById(fbUser.id);
        if (!user) {
            const result = await this.fbAuthService.createUser(fbUser);
            if (result.error) {
                throw new BadRequestException({ error: result.error });
            }
            user = result.data;
        }
        const loginResult = await this.authService.logIn(
            user,
            this.userService.getDefaultRole(),
        );
        if (loginResult.error) {
            throw new BadRequestException(loginResult);
        }
        return loginResult.data;
    }
}
