import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Type,
} from "@nestjs/common";
import { AuthDataHandler } from "../interfaces";
import { AuthorizationService } from "../services/authorization.service";
import { DefaultAuthDataHandler } from "../utils/default-auth-data-handler";
import { Reflector } from "@nestjs/core";
import { AuthDataHandlerType } from "../utils/auth-data-handler-type";
import { DECORATOR_METHOD_TAG, MethodTagValues } from "../consts";

export function AuthorizationGuard(
    AuthDataClass?: AuthDataHandlerType,
): Type<CanActivate> {
    @Injectable()
    class MixinAuthorizationGuard implements CanActivate {
        private authDataHandler: AuthDataHandler;

        constructor(
            private authorizationService: AuthorizationService,
            private reflector: Reflector,
        ) {
            this.authDataHandler = AuthDataClass
                ? new AuthDataClass(reflector)
                : new DefaultAuthDataHandler(reflector);
        }

        async canActivate(context: ExecutionContext) {
            // The route is decorated with `NonAuthorize` decorator
            if (this.isNonAuthorize(context)) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authData = await Promise.resolve(
                this.authDataHandler.getAuthData(context),
            );

            // The route is not guarded
            if (!authData) {
                return true;
            }

            const allowed = await this.authorizationService.authorize(
                authData.type,
                authData,
            );

            if (!allowed) {
                throw new ForbiddenException();
            }

            req.authorization = authData;
            return true;
        }

        protected isNonAuthorize(context: ExecutionContext) {
            const methodTag = this.reflector.getAllAndOverride<string>(
                DECORATOR_METHOD_TAG,
                [context.getClass(), context.getHandler()],
            );
            return methodTag === MethodTagValues.Nonauthorize;
        }
    }

    return MixinAuthorizationGuard;
}
