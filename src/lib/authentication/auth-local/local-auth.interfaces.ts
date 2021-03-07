export interface TokenAuthOptions {
    autoRefresh?: boolean;
    attachCookies?: boolean;
}

export interface RefreshTokenPayload {
    uid: string;
}

export interface AccessTokenPayload {
    uid: string;
}

export interface TokenValidateOptions {
    autoRefresh?: boolean;
}

export interface LocalAuthTokenValues {
    refreshToken?: string;
    accessToken?: string;
}

export interface LocalAuthModuleConfig {
    accessTokenMaxAge: string;
    accessTokenSecretKey: string;
    refreshTokenMaxAge: string;
    refreshTokenSecretKey: string;
}

export interface UserData {
    user_id: string;
    username: string;
    profile?: any;
}
