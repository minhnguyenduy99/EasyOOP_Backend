import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { ID_TOKEN_KEY } from "../consts";
import { GoogleAuthService } from "../services";

@Injectable()
export class GoogleTokenIdGuard implements CanActivate {
    constructor(private googleAuth: GoogleAuthService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest() as Request;
        const googleIdToken = req.query[ID_TOKEN_KEY] as string;
        if (!googleIdToken) {
            throw new BadRequestException({
                error: "Id token is missing",
            });
        }
        const user = await this.googleAuth.verifyIdToken(googleIdToken);
        console.log(user);
        if (!user) {
            throw new BadRequestException({
                error: "Id token is invalid",
            });
        }
        req["user"] = user;
        return true;
    }
}
