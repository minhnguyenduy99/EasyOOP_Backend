import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { GlobalAuthUserService, UserVerifier } from "../../core";
import { FacebookUserService } from "../auth-fb.service";

@Controller("auth")
export class UserVerifyController {
    constructor(
        private readonly verifyService: UserVerifier,
        private readonly fbAuthService: FacebookUserService,
        private readonly userService: GlobalAuthUserService,
    ) {}

    @Get("/verify")
    async verify(@Query("code") code: string) {
        const result = await this.verifyService.verify(code);
        return result;
    }

    @Get("/resend")
    @UseInterceptors(ClassSerializerInterceptor)
    async resendVerification(@Query("user-id") userId: string) {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException({
                code: 404,
                error: "User not found",
            });
        }
        const verification = await this.verifyService.createVerify(user);
        if (verification.error) {
            throw new BadRequestException(verification);
        }
        return {
            code: 0,
        };
    }
}
