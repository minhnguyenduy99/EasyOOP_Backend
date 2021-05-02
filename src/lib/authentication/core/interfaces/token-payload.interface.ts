export interface RefreshTokenPayload {
    user_id: string;
}

export interface AccessTokenPayload {
    user_id: string;
    active_role: string;
}
