import { UnauthorizedException } from "@nestjs/common";

export class RefreshTokenInvalid extends UnauthorizedException {
    constructor() {
        super({
            code: 26000,
            message: "Refresh token invalid",
        });
    }
}

export class AccessTokenInvalid extends UnauthorizedException {
    constructor() {
        super({
            code: 26001,
            message: "Access token invalid",
        });
    }
}
