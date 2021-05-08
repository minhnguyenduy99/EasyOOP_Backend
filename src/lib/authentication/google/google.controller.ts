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
    LoginAttachTokenInterceptor,
    LoginResultDTO,
} from "../core";
import { GoogleUser } from "./interfaces";
import { AuthGoogleUserDTO } from "./dto";
import { CommonResponse, ToObjectTransform } from "src/lib/types";
import { GoogleAuthGuard, GoogleTokenIdGuard } from "./guards";
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
    @Serialize(
        CommonResponse(AuthGoogleUserDTO, { dataTransform: ToObjectTransform }),
        true,
    )
    async authRedirect(@Req() request) {
        const user = request["user"] as GoogleUser;
        const googleUser = await this.userService.getUserById(user.id);
        if (googleUser) {
            return {
                code: 0,
                data: googleUser,
            };
        }
        const result = await this.googleUserService.createUser(
            user as CreateUserDTO,
        );
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/login-with-token")
    @UseInterceptors(LoginAttachTokenInterceptor)
    @Serialize(CommonResponse(LoginResultDTO()))
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
        return loginResult;
    }
}
