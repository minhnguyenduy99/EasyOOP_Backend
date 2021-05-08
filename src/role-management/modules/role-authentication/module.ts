import { Module } from "@nestjs/common";
import { RoleManagementCoreModule } from "../core";
import { RoleAuthenticationService } from "./service";

@Module({
    imports: [RoleManagementCoreModule],
    providers: [RoleAuthenticationService],
    exports: [RoleAuthenticationService],
})
export class RoleAuthenticationModule {}
