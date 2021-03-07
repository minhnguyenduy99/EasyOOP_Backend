import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import {
    ActionType,
    DECORATOR_ACTION,
    DECORATOR_RESOURCE_HANDLER,
    PolicyActionType,
} from "../consts";
import { AuthData, AuthDataHandler, ResourceHandler } from "../interfaces";

export abstract class BaseAuthDataHandler implements AuthDataHandler {
    constructor(protected reflector: Reflector) {}

    getAuthData(context: ExecutionContext): AuthData | Promise<AuthData> {
        const req = context.switchToHttp().getRequest() as Request;
        const entityAction = this.reflector.get<string[]>(
            DECORATOR_ACTION,
            context.getHandler(),
        );

        if (!entityAction) {
            return null;
        }

        const [name, type] = entityAction;

        const resourceHandler =
            this.reflector.getAllAndOverride<ResourceHandler>(
                DECORATOR_RESOURCE_HANDLER,
                [context.getHandler(), context.getClass()],
            ) ?? ((req) => req.headers["qw-resource-id"]);

        const [entityName, action] = name.split(".");
        if (!entityName || !action) {
            return null;
        }

        if (type === ActionType.role) {
            return {
                principal_id: this.getPrincipalId(req),
                entity_name: entityName,
                action_name: action,
                type: type,
            };
        }

        return {
            principal_id: this.getPrincipalId(req),
            entity_name: entityName,
            action_name: action,
            type: type as PolicyActionType,
            resources: resourceHandler(req),
        };
    }

    protected abstract getPrincipalId(req: Request): string;
}
