import { Reflector } from "@nestjs/core";
import { AuthDataHandler } from "../interfaces";

export type AuthDataHandlerType<T extends AuthDataHandler = any> = {
    new (reflector: Reflector): T;
};
