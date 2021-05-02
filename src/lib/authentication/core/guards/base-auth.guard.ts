import { ExecutionContext, Type } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsRoutePublic } from "./is-route-public.interface";

export function BaseAuthGuard(type: string | string[]): Type<any> {
    class BaseLocalAuthGuard extends AuthGuard(type) implements IsRoutePublic {
        private static PUBLIC_FIELD = "isPublic";

        isPublic(context: ExecutionContext): boolean | Promise<boolean> {
            const req = context.switchToHttp().getRequest();
            const isPublic = req[BaseLocalAuthGuard.PUBLIC_FIELD];
            return isPublic;
        }

        canActivate(context: ExecutionContext) {
            if (this.isPublic(context)) {
                return true;
            }
            return super.canActivate(context);
        }
    }

    return BaseLocalAuthGuard;
}
