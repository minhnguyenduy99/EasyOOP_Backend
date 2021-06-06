import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationService } from "../services";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthenticationService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const result = await this.authService.loginUserWithPassword(
            username,
            password,
        );
        if (result.error) {
            throw new UnauthorizedException(result);
        }
        return result.data;
    }
}
