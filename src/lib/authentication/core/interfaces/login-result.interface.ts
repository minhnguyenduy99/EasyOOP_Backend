import { AuthUser } from "../models";

export interface LoginResult {
    user: AuthUser;
    accessToken: string;
    refreshToken?: string;
}

export interface AuthInfo {
    accessToken?: string;
    roleId?: string;
}
