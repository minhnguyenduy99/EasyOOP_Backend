import {
    ClassSerializerInterceptor,
    Injectable,
    UnauthorizedException,
    UseInterceptors,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { LocalAuthService } from "../local-auth.service";

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: LocalAuthService) {
        super();
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException(
                "Username or password is incorrect",
            );
        }
        return user;
    }
}
