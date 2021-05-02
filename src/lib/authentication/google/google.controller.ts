import {
    BadRequestException,
    Controller,
    Get,
    HttpStatus,
    Req,
    UseGuards,
} from "@nestjs/common";
import { Serialize } from "src/lib/helpers";
import { Request } from "express";
import { CreateUserDTO, GlobalAuthUserService } from "../core";
import { GoogleAuthGuard } from "./google.guard";
import { GoogleUserService } from "./google.service";
import { GoogleUser } from "./interfaces";
import { AuthGoogleUserDTO } from "./dto";
import { CommonResponse, ToObjectTransform } from "src/lib/types";

@Controller("/auth/google")
@UseGuards(GoogleAuthGuard)
export class GoogleController {
    constructor(
        private readonly googleUserService: GoogleUserService,
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
}
