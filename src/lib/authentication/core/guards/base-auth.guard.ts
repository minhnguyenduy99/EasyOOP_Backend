import { ExecutionContext, Inject, Injectable, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { DECORATORS } from "../consts";
import { IsRoutePublic } from "./is-route-public.interface";

export function BaseAuthGuard(type: string | string[]): Type<any> {
    @Injectable()
    class BaseLocalAuthGuard extends AuthGuard(type) implements IsRoutePublic {
        private static PUBLIC_FIELD = "isPublic";
        @Inject(Reflector)
        protected reflector: Reflector;

        isPublic(context: ExecutionContext): boolean | Promise<boolean> {
            const isPublic = this.reflector.getAllAndOverride(
                DECORATORS.IS_PUBLIC_DECORATOR,
                [context.getHandler(), context.getClass()],
            );
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
