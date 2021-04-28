import { ExecutionContext } from "@nestjs/common";
import { PolicyActionType } from "../consts";

/**
 * Defines an interface to get the authorization data
 */
export interface AuthDataHandler {
    getAuthData(context: ExecutionContext): AuthData | Promise<AuthData>;
}

export interface AuthData {
    principal_id: string;
    entity_name: string;
    action_name: string;
    type?: PolicyActionType;
    resources?: string | string[];
}

export interface TokenAuthDataHandlerOptions {
    dataField: string;
    tokenField?: string;
    from?: "cookies" | "headers";
}
