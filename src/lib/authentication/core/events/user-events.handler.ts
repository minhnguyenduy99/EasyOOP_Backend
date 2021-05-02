import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AuthorizationService } from "src/lib/authorization";
import { USER_EVENTS } from "./user.event";

@Injectable()
export class UserEventsHandler {
    constructor(private authorizationService: AuthorizationService) {}

    // @OnEvent(USER_EVENTS.UserActivated, { async: true })
    // async onUserActivated({ user }) {
    //     this.authorizationService.createPrincipal({
    //         principal_id: user.user_id,
    //         role_name: user.roles[0],
    //         self_added: true,
    //     });
    // }

    @OnEvent(USER_EVENTS.UserCreated, { async: true })
    async onUserCreate({ user }) {
        const result = await this.authorizationService.createPrincipal({
            principal_id: user.user_id,
            role_name: user.roles[0],
            self_added: true,
        });
        console.log(result);
    }
}
