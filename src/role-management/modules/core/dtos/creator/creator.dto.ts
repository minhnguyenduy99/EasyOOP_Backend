import { Expose } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { RoleDTO } from "../role.dto";

export class CreatorDTO extends BaseModelSerializer {
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
