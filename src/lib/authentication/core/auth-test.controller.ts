import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UseInterceptors,
} from "@nestjs/common";
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { CommonResponse } from "src/lib/types";
import { AuthUserDto, LoginResultDTO } from "./dtos";
import { LoginAttachAuthInfoInterceptor } from "./interceptors";
import { AuthenticationService } from "./services";

@Controller("/tests/auth")
@UseInterceptors(ResponseSerializerInterceptor)
export class AuthTestController {
    constructor(private authenticator: AuthenticationService) {}

    @Post("/login")
    @UseInterceptors(LoginAttachAuthInfoInterceptor)
    @Serialize(AuthUserDto)
    async login(@Body() body: any) {
        const { user_id } = body;
        const result = await this.authenticator.logIn(user_id);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result.data;
    }
}
