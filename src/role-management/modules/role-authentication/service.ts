import { Injectable } from "@nestjs/common";
import {
    AuthenticationService,
    LoginResult,
    ServiceResult,
} from "src/lib/authentication/core";
import { CreatorService, ERRORS, ManagerService, ROLES } from "../core";

export interface IRoleAuthenticationService {
    loginAsCreator(userId: string): Promise<ServiceResult<any>>;
    loginAsManager(userId: string): Promise<ServiceResult<any>>;
}

@Injectable()
export class RoleAuthenticationService implements IRoleAuthenticationService {
    constructor(
        private userAuthService: AuthenticationService,
        private creatorService: CreatorService,
        private managerService: ManagerService,
    ) {}

    async loginAsCreator(userId: string) {
        const creator = await this.creatorService.getByUserId(userId, {
            groups: ["user"],
        });
        if (!creator) {
            return ERRORS.InvalidRoleType;
        }
        const result = await this.loginAsRole(creator, ROLES.creator);
        return result;
    }

    async loginAsManager(userId: string) {
        const manager = await this.managerService.getByUserId(userId, {
            groups: ["user"],
        });
        if (!manager) {
            return ERRORS.InvalidRoleType;
        }
        const result = await this.loginAsRole(manager, ROLES.manager);
        return result;
    }

    protected async loginAsRole(user, role) {
        const result = await this.userAuthService.logIn(user, role, {
            role_id: user.role_id,
        });
        if (result.error) {
            return result;
        }
        const authUser = result.data as any;
        authUser.role_id = user.role_id;
        return {
            code: result.code,
            data: authUser,
        };
    }
}
