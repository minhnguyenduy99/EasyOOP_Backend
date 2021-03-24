import { Exclude } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";

export class AuthUserDTO extends BaseModelSerializer {
    @Exclude()
    username?: string;

    @Exclude()
    password: string;

    @Exclude()
    type: string;
}
