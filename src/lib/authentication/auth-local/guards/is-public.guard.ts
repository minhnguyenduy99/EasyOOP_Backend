import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_DECORATOR } from "../consts";

@Injectable()
export class IsPublicGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_DECORATOR,
            [context.getHandler(), context.getClass()],
        );
        request["isPublic"] = isPublic;
        return true;
    }
}
