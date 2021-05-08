import { AuthUserDto } from "src/lib/authentication/core";

export class RoleDTO extends AuthUserDto {
    role_id: string;
    alias: string;
    user_id: string;
    config_id: string;
    created_date: number;
}
