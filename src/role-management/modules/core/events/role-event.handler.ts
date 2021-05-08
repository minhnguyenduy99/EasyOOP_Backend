import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { GlobalAuthUserService } from "src/lib/authentication/core";
import { AuthorizationService } from "src/lib/authorization";
import { ROLE_EVENTS } from "./events";

@Injectable()
export class RoleEventsHandler {
    constructor(
        private authorizationService: AuthorizationService,
        private userService: GlobalAuthUserService,
    ) {}

    @OnEvent(ROLE_EVENTS.ROLE_CREATED, { async: true })
    async onRoleCreated({ role, roleType }) {
        await Promise.all([
            this.authorizationService.createPrincipal({
                principal_id: role.role_id,
                role_name: roleType,
                self_added: true,
            }),
            this.userService.assignRole(role.user_id, roleType),
        ]);
    }
}
