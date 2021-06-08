import { Expose } from "class-transformer";
import { AuthUserDto } from "src/lib/authentication";
import { BaseModelSerializer } from "src/lib/helpers";

export class ManagerDTO extends AuthUserDto {
    role_id: string;
    alias: string;
    user_id: string;
    config_id: string;
    created_date: number;

    @Expose()
    manager_id() {
        return this.role_id;
    }
}
