import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { UserVerifier } from "../../core";
import { AuthFacebookService } from "../auth-fb.service";

@Controller("/verify")
export class UserVerifyController {
    constructor(
        private readonly verifyService: UserVerifier,
        private readonly fbAuthService: AuthFacebookService,
    ) {}

    @Get()
    async verify(@Query("code") code: string) {
        const result = await this.verifyService.verify(code);
        return result;
    }

    @Get("/resend")
    @UseInterceptors(ClassSerializerInterceptor)
    async resendVerification(@Query("user-id") userId: string) {
        const user = await this.fbAuthService.findUserById(userId);
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
