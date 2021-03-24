import { Controller, Query } from "@nestjs/common";
import { UserVerifier } from "../../core";

@Controller("/verify")
export class UserVerifyController {
    constructor(private readonly verifyService: UserVerifier) {}

    async verify(@Query("code") code: string) {
        const result = await this.verifyService.verify(code);
        return result;
    }
}
