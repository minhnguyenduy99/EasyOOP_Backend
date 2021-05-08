import { Inject, Injectable } from "@nestjs/common";
import { Request } from "express";
import { BaseAuthDataHandler } from "src/lib/authorization";
import { ROLE_COOKIE_KEY } from "./consts";

@Injectable()
export class RoleDataHandler extends BaseAuthDataHandler {
    protected async getPrincipalId(req: Request) {
        const roleId = req.cookies[ROLE_COOKIE_KEY];
        return roleId ?? null;
    }
}
