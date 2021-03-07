import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthorizationModuleException extends HttpException {
    public readonly code: number;

    constructor(
        message = "AuthorizationModuleException",
        code = 75000,
        status = HttpStatus.BAD_REQUEST,
    ) {
        super(message, status);
        this.code = code;
    }
}

export class InvalidRoleAssignException extends AuthorizationModuleException {
    constructor() {
        super("Invalid role assign", 75001);
    }
}

export class InvalidRolePolicyException extends AuthorizationModuleException {
    constructor() {
        super("Invalid role policy", 75002);
    }
}

export class RolePolicyActionDeniedException extends AuthorizationModuleException {
    constructor() {
        super("Action is not allowed on this role policy", 75003);
    }
}

export class InvalidPrincipalException extends AuthorizationModuleException {
    constructor() {
        super("The principal is invalid", 75004);
    }
}

export class InvalidActionException extends AuthorizationModuleException {
    constructor() {
        super("The action is invalid", 75003);
    }
}
