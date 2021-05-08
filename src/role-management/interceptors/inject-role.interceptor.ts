import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RoleUserOptions } from "../interfaces";
import {
    BaseRoleService,
    CreatorService,
    ManagerService,
    ROLES,
} from "../modules/core";
import {
    ROLE_COOKIE_KEY,
    USER_KEY,
    USER_ROLE_KEY,
    USER_ROLE_OPTIONS_DECORATOR,
} from "../utils";

@Injectable()
export class InjectRoleInterceptor implements NestInterceptor {
    private serviceObj: Record<string, BaseRoleService>;
    constructor(
        private reflector: Reflector,
        private managerService: ManagerService,
        private creatorService: CreatorService,
    ) {
        this.serviceObj = {
            [ROLES.creator]: this.creatorService,
            [ROLES.manager]: this.managerService,
        };
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const user = req[USER_KEY];
        if (!user) {
            return next.handle();
        }

        const userRoleOptions = this.reflector.getAllAndOverride(
            USER_ROLE_OPTIONS_DECORATOR,
            [context.getHandler(), context.getClass()],
        ) as RoleUserOptions;

        const { fullInfo = false } = userRoleOptions ?? {};
        const roleId = req.cookies[ROLE_COOKIE_KEY];
        const { user_id, active_role } = user;
        let roleUser;
        if (fullInfo) {
            roleUser = this.serviceObj[active_role]?.getByUserId(user_id);
        } else {
            roleUser = {
                user_id,
                role_id: roleId,
            };
        }
        req[USER_ROLE_KEY] = roleUser;
        return next.handle();
    }
}
