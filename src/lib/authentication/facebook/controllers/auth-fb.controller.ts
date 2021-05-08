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
    AttachTokenInterceptor,
    AuthenticationService,
    AuthUserDto,
    GlobalAuthUserService,
    LoginResultDTO,
} from "../../core";
import { LoginAttachTokenInterceptor } from "../../core/interceptors/login-attach-token.interceptor";
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
    async loginFacebook(@Req() req: Request) {
        return HttpStatus.OK;
    }

    @Get("/redirect")
    @UseGuards(FacebookGuard)
    @Serialize(CommonResponse(LoginResultDTO()))
    @UseInterceptors(LoginAttachTokenInterceptor)
    async facebookLoginRedirect(@Req() req: Request, @Res() res): Promise<any> {
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
        return loginResult;
    }

    @Get("/login-with-token")
    @UseGuards(FacebookTokenGuard)
    @UseInterceptors(LoginAttachTokenInterceptor)
    @Serialize(CommonResponse(AuthUserDto))
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
        return loginResult;
    }
}
