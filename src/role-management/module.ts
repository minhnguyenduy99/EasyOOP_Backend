import { Module } from "@nestjs/common";
import { AuthorizationModule } from "src/lib/authorization";
import {
    CreatorController,
    ManagerController,
    RoleAuthenticationController,
} from "./controllers";
import { RoleManagementCoreModule } from "./modules/core";
import { RoleAuthenticationModule } from "./modules/role-authentication";
import authorizationConfig from "./authorization.config";
import { PaginationModule } from "src/lib/pagination";

@Module({
    imports: [
        RoleAuthenticationModule,
        RoleManagementCoreModule,
        AuthorizationModule.forFeature({ config: authorizationConfig }),
        PaginationModule,
    ],
    controllers: [
        CreatorController,
        ManagerController,
        RoleAuthenticationController,
    ],
})
export class RoleManagementModule {}
