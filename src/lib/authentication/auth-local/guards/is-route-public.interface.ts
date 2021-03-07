import { ExecutionContext } from "@nestjs/common";

export interface IsRoutePublic {
    isPublic(context: ExecutionContext): boolean | Promise<boolean>;
}
