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
        const user = await this.authService.loginUserWithPassword(
            username,
            password,
        );
        if (!user) {
            throw new UnauthorizedException({
                error: "Invalid username or password",
            });
        }
        return user;
    }
}
