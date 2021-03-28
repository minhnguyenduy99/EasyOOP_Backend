import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { FacebookGuard } from "../auth-fb.guard";
import { FacebookUserService } from "../auth-fb.service";
import { FacebookUser } from "../interfaces";
import { AuthUserDTO } from "./dto";

@Controller("/auth/facebook")
@UseGuards(FacebookGuard)
export class FacebookAuthController {
    constructor(private readonly fbAuthService: FacebookUserService) {}

    @Get("/login")
    async loginFacebook(@Req() req: Request) {
        return HttpStatus.OK;
    }

    @Get("redirect")
    @UseInterceptors(ClassSerializerInterceptor)
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        const fbUser = req["user"] as FacebookUser;
        const user = await this.fbAuthService.getUserById(fbUser.id);
        if (user) {
            return new AuthUserDTO(user.toObject());
        }
        const result = await this.fbAuthService.createUser(fbUser);
        if (result.error) {
            throw new BadRequestException({ error: result.error });
        }
        return new AuthUserDTO(result.data?.toObject() ?? result.data);
    }
}
