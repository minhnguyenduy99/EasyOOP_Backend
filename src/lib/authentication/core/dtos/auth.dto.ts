export interface CreateUserDTO {
    accountType: string;
    isActive?: boolean;
    role?: string;
    // for future use
    [key: string]: any;
}

export interface AuthUserDTO {
    user_id: string;
    username?: string;
    password?: string;
    password_required?: boolean;
    email?: string;
    profile?: UserProfileDTO;
    login_status?: boolean;
    is_active?: boolean;
    type?: string;
    accessToken?: string;
    roles?: string;
    active_role?: string;
}

export interface UserProfileDTO {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    profile_pic?: string;
}

export interface ValidateUserOptions {
    password?: string;
}
