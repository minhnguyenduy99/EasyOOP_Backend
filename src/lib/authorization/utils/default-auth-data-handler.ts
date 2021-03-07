import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { PRINCIPAL_HEADER_FIELD } from "../consts";
import { BaseAuthDataHandler } from "./base-auth-data-handler";

@Injectable()
export class DefaultAuthDataHandler extends BaseAuthDataHandler {
    protected getPrincipalId(req: Request) {
        return req.headers[PRINCIPAL_HEADER_FIELD] as string;
    }
}
