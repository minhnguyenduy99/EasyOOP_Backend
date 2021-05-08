import { Injectable } from "@nestjs/common";
import { AuthorizationGuard } from "src/lib/authorization/guards/authorization-guard";
import { RoleDataHandler } from "./role-data-handler";

@Injectable()
export class RoleAuthorizationGuard extends AuthorizationGuard(
    RoleDataHandler,
) {}
