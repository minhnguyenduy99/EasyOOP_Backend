import { Injectable, Optional, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenAuthDataHandlerOptions } from "../interfaces/auth-data-handler";
import { BaseAuthDataHandler } from "./base-auth-data-handler";

export const TokenAuthDataHandler = (
    options: TokenAuthDataHandlerOptions,
): Type<BaseAuthDataHandler> => {
    const { dataField, tokenField, from = "cookies" } = options;

    @Injectable()
    class TokenAuthClass extends BaseAuthDataHandler {
        constructor(
            private jwtServcice: JwtService,
            protected reflector: Reflector,
        ) {
            super(reflector);
        }

        async getPrincipalId(req: Request) {
            const token = req[from][tokenField];
            const principalId = await this.parseToken(token);
            return principalId;
        }

        protected async parseToken(token: string) {
            const payload = await this.jwtServcice.verifyAsync(token);
            return payload?.[dataField];
        }
    }

    return TokenAuthClass;
};
