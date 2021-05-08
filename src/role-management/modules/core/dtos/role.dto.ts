import { BaseModelSerializer } from "src/lib/helpers";

export class RoleDTO extends BaseModelSerializer {
    role_id: string;
    alias: string;
    user_id: string;
    config_id: string;
    created_date: number;
}
