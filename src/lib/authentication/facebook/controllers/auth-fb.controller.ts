import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AuthFacebookService } from "../auth-fb.service";
import { FacebookUser } from "../interfaces";
import { AuthUserDTO } from "./dto";

@Controller("/facebook")
@UseGuards(AuthGuard("facebook"))
export class FacebookAuthController {
    constructor(private readonly fbAuthService: AuthFacebookService) {}

    @Get()
    async loginFacebook() {
        return HttpStatus.OK;
    }

    @Get("redirect")
    @UseInterceptors(ClassSerializerInterceptor)
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        const user = req["user"] as FacebookUser;
        const result = await this.fbAuthService.createUser({
            accountType: "facebook",
            ...user,
        });
        if (result.error) {
            throw new BadRequestException({ error: result.error });
        }
        return new AuthUserDTO(result.data?.toObject() ?? result.data);
    }
}
