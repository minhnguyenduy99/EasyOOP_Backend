import { Inject, Injectable } from "@nestjs/common";
import {
    AuthenticationService,
    AuthUserDto,
    LoginResult,
    ServiceResult,
} from "src/lib/authentication/core";
import { CreatorService, ManagerService, ROLES } from "../core";
import { CONFIG_KEYS } from "./config";
import { ERRORS } from "../../errors";
import { CoreAuthenticationConfig } from "./interfaces";

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
        @Inject(CONFIG_KEYS.MODULE_CONFIG)
        private config: CoreAuthenticationConfig,
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

    async loginAsViewer(userId: string) {
        const result = await this.loginAsRole(userId, ROLES.viewer);
        return result;
    }

    async loginAsRoot(rootUser: AuthUserDto) {
        const { rootRoleID } = this.config;
        rootUser.role_id = rootRoleID;
        const result = await this.userAuthService.logIn(
            rootUser as any,
            ROLES.admin,
            {
                role_id: rootRoleID,
            },
        );
        return result;
    }

    protected async loginAsRole(user, role) {
        const result = await this.userAuthService.logIn(user, role, {
            role_id: user.role_id,
        });
        return result;
    }
}
