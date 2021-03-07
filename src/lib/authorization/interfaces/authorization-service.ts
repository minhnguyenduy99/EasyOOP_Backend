import { PolicyActionType } from "../consts";
import {
    CreatePrincipalOptions,
    CreatePrincipalPolicyOptions,
    PrincipalPolicyKey,
} from "../dto";
import { PrincipalDTO, PrincipalPolicyDTO } from "../models";
import { AuthData } from "./auth-data-handler";

export interface IAuthorizationService {
    authorize(
        type: PolicyActionType,
        authData: AuthData,
    ): boolean | Promise<boolean>;

    createPrincipal(options: CreatePrincipalOptions): Promise<PrincipalDTO>;

    createPrincipalPolicy(
        options: CreatePrincipalPolicyOptions,
    ): Promise<PrincipalPolicyDTO>;

    addResource(
        principalPolicy: PrincipalPolicyKey,
        resource: string,
    ): Promise<boolean>;

    removeResource(
        principalPolicy: PrincipalPolicyKey,
        resource: string,
    ): Promise<boolean>;
}
