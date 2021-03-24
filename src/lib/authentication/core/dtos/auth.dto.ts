export interface CreateUserDTO {
    accountType: string;
    // for future use
    [key: string]: any;
}

export interface AuthUserDTO {
    user_id: string;
    username?: string;
    email?: string;
    profile?: UserProfileDTO;
    is_active?: boolean;
    type?: string;
}

export interface UserProfileDTO {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    profile_pic?: string;
}
