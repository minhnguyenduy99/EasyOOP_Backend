import { Exclude, Expose } from "class-transformer";
import { RoleDTO } from "../role.dto";

export class CreatorDTO extends RoleDTO {
    @Exclude()
    role_id: string;
    alias: string;
    user_id: string;
    config_id: string;
    created_date: number;

    @Expose()
    creator_id() {
        return this.role_id;
    }
}
