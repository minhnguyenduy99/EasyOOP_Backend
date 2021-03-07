import { PrincipalDTO } from "../models";
import { IAuthorizationService } from "./authorization-service";

export interface IAuthorizationHook {
    onPrincipalCreated(
        principal: PrincipalDTO,
        authService: IAuthorizationService,
    ): Promise<void>;

    onPrincipalRemoved(authService: IAuthorizationService): Promise<void>;
}

export type OnPrincipalCreated = Pick<IAuthorizationHook, "onPrincipalCreated">;
export type OnPrincipalRemoved = Pick<IAuthorizationHook, "onPrincipalRemoved">;
