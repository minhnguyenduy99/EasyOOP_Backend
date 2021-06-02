import {
    BadRequestException,
    Controller,
    Get,
    HttpStatus,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { Request } from "express";
import {
    AuthenticationService,
    AuthUserDecorator,
    CreateUserDTO,
    GlobalAuthUserService,
    LoginAttachAuthInfoInterceptor,
    LoginResultDTO,
} from "../core";
import { GoogleUser } from "./interfaces";
import { GoogleTokenIdGuard } from "./guards";
import { GoogleUserService } from "./services";

@Controller("/auth/google")
// @UseGuards(GoogleAuthGuard)
@UseInterceptors(ResponseSerializerInterceptor)
export class GoogleController {
    constructor(
        private readonly googleUserService: GoogleUserService,
        private authService: AuthenticationService,
        private userService: GlobalAuthUserService,
    ) {}

    @Get("/login")
    login(@Req() request: Request) {
        return HttpStatus.OK;
    }

    @Get("/redirect")
    @Serialize(LoginResultDTO())
    async authRedirect(@Req() request) {
        const googleUser = request["user"] as GoogleUser;
        let user = await this.userService.getUserById(googleUser.id);
        if (!user) {
            const createUserResult = await this.googleUserService.createUser(
                googleUser as any,
            );
            if (createUserResult.error) {
                throw new BadRequestException(createUserResult);
            }
            user = createUserResult.data;
        }
        const loginResult = await this.authService.logIn(user);
        if (loginResult.error) {
            throw new BadRequestException(loginResult);
        }
        return loginResult.data;
    }

    @Get("/login-with-token")
    @UseInterceptors(LoginAttachAuthInfoInterceptor)
    @Serialize(LoginResultDTO())
    @UseGuards(GoogleTokenIdGuard)
    async authByTokenId(@AuthUserDecorator("user") user: GoogleUser) {
        let googleUser = await this.userService.getUserById(user.id);
        if (!googleUser) {
            const result = await this.googleUserService.createUser(
                user as CreateUserDTO,
            );
            if (result.error) {
                throw new BadRequestException(result);
            }
            googleUser = result.data;
        }
        const loginResult = await this.authService.logIn(googleUser);
        if (loginResult.error) {
            throw new BadRequestException(loginResult);
        }
        return loginResult.data;
    }
}
